---
title: "Multi-input clustering all of Bitcoin on a laptop"
slug: "multi-input-clustering-bitcoin-on-a-laptop"
date: 2026-07-20
author: "Thomas Niedermayer"
description: "The multi-input clustering engine behind Iknaio is now a stand-alone PyPI package. Together with a Delta Lake and DuckDB it clusters all 1.4 billion Bitcoin transactions on an ordinary laptop."
tags: ["clustering", "bitcoin", "open-source"]
image: "images/insights/clustering/cover.jpg"
posttype: "tech-deep-dive"
---

Address clustering is a widely used technique for analyzing UTXO blockchains such as Bitcoin. It groups addresses that might be controlled by the same actor and is therefore useful for generating investigation leads.

Previously, this computational step was buried deep inside our fairly complex Spark computation job. Now it is available as a stand-alone package on PyPI: [graphsense-clustering](https://pypi.org/project/graphsense-clustering/), an efficient implementation written in Rust with Python bindings.

This post introduces the multi-input heuristic, shows how computing its clusters reduces to finding connected components, and then runs the complete pipeline over the entire Bitcoin transaction history (1.4 billion transactions) on an ordinary laptop. The code itself is chain-agnostic; the same steps apply to other UTXO-based blockchains such as Litecoin, Zcash, or Bitcoin Cash.

## What is the multi-input heuristic?

Whenever a transaction with multiple input addresses is executed on a UTXO blockchain like Bitcoin, one can assume that the keys required to spend from these addresses were controlled by the same actor, at least at the time the transaction was executed. An actor can be a cryptocurrency exchange, a darknet marketplace, or simply a hardware wallet owned by an individual user. This observation goes back to the original Bitcoin whitepaper, which notes that multi-input transactions "necessarily reveal that their inputs were owned by the same owner" [[1]](#references).

The observation translates directly into a computer program that combines all input addresses of a transaction into so-called "clusters". Applied transitively over the whole chain, this rule partitions the address space: if one transaction spends from addresses A and B, and a later one spends from B and C, then A, B, and C form one cluster. Technically, this approach is called a "heuristic": a practical problem-solving method that produces a good-enough solution efficiently, without guaranteeing correctness or optimality.

That last point matters. Working with clusters is practical because it condenses a large search space (addresses) into a much smaller one (clusters). The technique has proven very useful for generating investigation leads. However, care must be taken when clustering results enter court proceedings. Years ago, we proposed measures to safeguard the evidential value of cryptoasset investigations, pointing out pitfalls such as CoinJoins and other collaborative transactions [[2]](#references). More recently, we evaluated the multi-input heuristic against a real-world ground-truth dataset and showed that its reliability varies considerably across entities [[3]](#references).

Handled and interpreted correctly, address clustering remains an extremely useful technique. Our rule of thumb: **use address clustering as a technique to identify leads, but not to present evidence in a forensic report**.

## Computing clusters

Finding address clusters is a graph problem. Take every input address as a node, and let every multi-input transaction connect its input addresses to each other. The clusters produced by the heuristic are then exactly the [connected components](https://en.wikipedia.org/wiki/Component_(graph_theory)) of this graph. For Bitcoin, this graph comprises 963.7 million nodes reached through 1.65 billion input references, so the algorithm for finding the components must be chosen with care.

The classic answer is the [Union-Find structure](https://en.wikipedia.org/wiki/Disjoint-set_data_structure), also known as a disjoint-set forest. It maintains, for every node, a pointer toward a representative of its component. Both looking up a node's component and merging two components take near-constant time. Processing a transaction therefore reduces to merging the components of its input addresses. A single pass over all transactions yields the complete clustering.

Union-Find would work with address strings as node labels, but keeping it fast requires an array with one slot per node. The pipeline below therefore first maps every address string to a dense integer id. With ids as array indices, a lookup becomes a plain memory access instead of a string comparison. All 963.7 million addresses fit into a single uint32 array of under 4 GB. The address strings (tens of gigabytes of them) stay out of the clustering entirely and return only at the very end.

## A Rust core with Python bindings

This machinery is now packaged as [graphsense-clustering](https://pypi.org/project/graphsense-clustering/), a parallel Union-Find implemented in Rust, exposed to Python as the module `gs_clustering`. Installing it is one command with [Astral uv](https://docs.astral.sh/uv/getting-started/installation/):

```bash
uv add graphsense-clustering
```

The minimal example is a handful of lines, with plain Python lists as input:

```python
from gs_clustering import Clustering

clustering = Clustering(max_address_id=7)
clustering.process_transactions([[1, 2, 3], [4, 5], [2, 7]])
print(clustering.get_mapping_min(skip_singletons=True).to_pydict())
```

Saved as `minimal_example.py`, the script prints the cluster assignment when run:

```bash
uv run minimal_example.py
```

```
{'address_id': [1, 2, 3, 4, 5, 7], 'cluster_id': [1, 1, 1, 4, 4, 1]}
```

Each inner list holds the input address ids of one transaction. The third transaction spends from addresses 2 and 7, so address 7 lands in the same cluster as 1, 2, and 3; this is the transitive rule at work. `get_mapping_min` labels every cluster with the smallest address id it contains (the same convention the Iknaio production pipeline uses). `skip_singletons=True` keeps only addresses that share a cluster with at least one other address.

## Clustering the full Bitcoin blockchain

Everything below ran on a laptop with an Intel i7-1365U and 32 GB of RAM. The full 831 GB transaction table sat on a local disk, and the machine had access to a Bitcoin node. The machine does not have to hold the whole table. The table can also live on a NAS or an object store; the pipeline reads only the columns clustering needs from wherever the table sits. This leaves around 100 GB of temporary disk space as the local requirement.

Scaling the minimal example to 1.4 billion transactions is a four-step pipeline. The times are from the Bitcoin run on the laptop above.

| Step | What happens | Tool | Time |
|---|---|---|---|
| 1 &middot; Ingest | Raw transactions from the node into a Delta Lake | graphsense-cli | about a week |
| 2 &middot; Map | Input addresses to dense uint32 ids | DuckDB | about 3 h |
| 3 &middot; Cluster | One pass of Union-Find over all transactions | graphsense-clustering | under 2 min |
| 4 &middot; Resolve | Cluster ids back to address strings | DuckDB | about 24 min |

The week in the first row covers syncing the node and ingesting the chain, both one-off costs. Once the Delta Lake exists, the analytics itself fits into an afternoon.

### Step 1: raw data in a Delta Lake

GraphSense ingests raw blockchain data from a node into a Delta Lake, an open table format on top of Parquet files. Ingest is one command of [graphsense-lib](https://github.com/graphsense/graphsense-lib), installed with its ingest extra (`uv add "graphsense-lib[ingest]"`), plus a small config file that points it at the node and the output directory. Any fully synced Bitcoin Core node works as the source, as long as it is not pruned. A pruned node discards old blocks after validating them, and the ingest needs every block from block 0. The very first run bootstraps the table in overwrite mode, since append expects an existing table:

```bash
graphsense-cli ingest from-node -e prod -c btc --sinks delta --write-mode overwrite --start-block 0
```

Later runs drop the two write flags and fall back to the default append mode, which continues from where the last run stopped. A full Bitcoin sync from the node takes on the order of a week, depending heavily on the connection and the performance of the node. The pace also drops as the ingest progresses, since the early years of the chain consist of nearly empty blocks while later ones arrive full. For a smaller ingest, the `--end-block` flag stops at a chosen block height, which is enough to test the whole pipeline on a slice of the chain.

The result is a `transaction` table with one row per transaction and the input addresses nested inside each row. For Bitcoin, the table holds 1.4 billion transactions and takes up 831 GB at the time of writing.

### Step 2: map addresses to integers with DuckDB

The dense ids the Union-Find wants do not exist yet. The chain only knows address strings. Before those ids can be assigned, the table has to shrink, because clustering needs exactly one thing from a transaction: its input addresses. Parquet stores every column separately, so a reader can request just the input addresses and skip hashes, scripts, amounts, and everything else in the files. On the Bitcoin table the input addresses account for 66.6 GB (8 percent of the total size).

From here on the pipeline runs on DuckDB (`uv add duckdb`) next to the packages already installed. The reduce step keeps one row of distinct input addresses per transaction, numbered with a running transaction key. Transactions with fewer than two distinct input addresses contribute nothing to clustering and are dropped on the fly:

```python
import duckdb
import pyarrow.parquet as pq
from deltalake import DeltaTable

con = duckdb.connect()
con.execute("SET memory_limit = '12GB'")
con.execute("SET temp_directory = 'data/duckdb_tmp'")

offset = 0
for n, f in enumerate(sorted(DeltaTable("data/transaction").file_uris())):
    batch = pq.ParquetFile(f).read(
        columns=["inputs.list.element.addresses.list.element"]
    )
    con.register("batch", batch)
    rows = con.execute(f"""
        COPY (
            SELECT {offset} + row_number() OVER () AS tx_key, addrs
            FROM (
                SELECT list_distinct(list_filter(
                    flatten(list_transform(inputs, i -> i.addresses)),
                    a -> a IS NOT NULL)) AS addrs
                FROM batch
            )
            WHERE len(addrs) >= 2
        ) TO 'data/tx_addr_lists/part_{n:05d}.parquet'
    """).fetchone()[0]
    offset += rows
```

What remains is 39 GB of address lists covering 229.8 million multi-input transactions, produced in a bit over two hours. The memory limit keeps DuckDB from claiming its default 80 percent of system RAM. Anything beyond 12 GB spills to the temp directory, and the rest of the machine stays usable. On a machine with more memory to spare, raising the limit speeds the queries up, since DuckDB then keeps intermediate results in RAM instead of spilling them to disk.

DuckDB then assigns the ids. Deduplicating 1.65 billion address references into 963.7 million distinct addresses exceeds what a 12 GB memory budget handles in a single query. The mapping therefore splits the addresses into 16 hash buckets and processes them one at a time. Each bucket deduplicates its addresses, assigns dense uint32 ids from its own range, and swaps the ids into the transaction pairs. A last pass groups the pairs back into one id list per transaction:

```python
BUCKETS = 16

con.execute(f"""
    COPY (
        SELECT tx_key, address, hash(address) % {BUCKETS} AS bucket
        FROM (
            SELECT tx_key, unnest(addrs) AS address
            FROM 'data/tx_addr_lists/*.parquet'
        )
    ) TO 'data/addr_pairs' (FORMAT PARQUET, PARTITION_BY (bucket))
""")

next_id = 1
for b in range(BUCKETS):
    n = con.execute(f"""
        COPY (SELECT DISTINCT address FROM 'data/addr_pairs/bucket={b}/*.parquet')
        TO 'data/bucket_addrs.parquet'
    """).fetchone()[0]
    con.execute(f"""
        COPY (
            SELECT address, ({next_id} + file_row_number)::UINTEGER AS address_id
            FROM read_parquet('data/bucket_addrs.parquet', file_row_number = true)
        ) TO 'data/address_ids_{b}.parquet'
    """)
    con.execute(f"""
        COPY (
            SELECT tx_key, address_id
            FROM 'data/addr_pairs/bucket={b}/*.parquet'
            JOIN 'data/address_ids_{b}.parquet' USING (address)
        ) TO 'data/id_pairs_{b}.parquet'
    """)
    next_id += n

for t in range(BUCKETS):
    con.execute(f"""
        COPY (
            SELECT list(address_id) AS ids
            FROM 'data/id_pairs_*.parquet'
            WHERE tx_key % {BUCKETS} = {t}
            GROUP BY tx_key
        ) TO 'data/tx_inputs_{t}.parquet'
    """)
con.execute(
    "COPY (SELECT * FROM 'data/address_ids_*.parquet') TO 'data/address_ids.parquet'"
)
```

The ids come from Parquet row numbers instead of a window function over the full address set. Each bucket starts its id range where the previous one stopped, so the 16 partial mappings concatenate into one dense id space. The whole mapping took 39 minutes. One caveat for anyone re-running the pipeline: the DISTINCT scan has no defined order, so a fresh run can assign different address ids and therefore different cluster labels. The grouping of addresses into clusters stays exactly the same.

### Step 3: run the clustering

The clustering itself looks just like the minimal example, except that DuckDB streams the id lists as Arrow batches (an in-memory columnar format both tools share), so the Rust engine reads each batch in place without copying it into Python objects:

```python
import duckdb
import pyarrow as pa
import pyarrow.parquet as pq
from gs_clustering import Clustering

con = duckdb.connect()
max_id = con.sql(
    "SELECT max(address_id) FROM 'data/address_ids.parquet'"
).fetchone()[0]

clustering = Clustering(max_address_id=max_id)
reader = con.execute(
    "SELECT ids FROM 'data/tx_inputs*.parquet'"
).to_arrow_reader(1_000_000)
for batch in reader:
    clustering.process_transactions_arrow(batch.column(0))

mapping = clustering.get_mapping_min(skip_singletons=True)
pq.write_table(pa.Table.from_batches([mapping]), "data/address_clusters.parquet")
```

The Union-Find holds a single uint32 per address, so even a chain with a billion addresses needs only a few GB of RAM for the array itself. Clustering Bitcoin (1.65 billion input references across 229.8 million transactions) took 78 seconds, with peak memory at 11.7 GB, most of it DuckDB streaming the batches.

### Step 4: map cluster ids back to addresses

The mapping comes back as integer pairs, so one join against the address table restores the address strings:

```python
import duckdb

con = duckdb.connect()
con.execute("""
    COPY (
        SELECT address, cluster_id
        FROM 'data/address_ids.parquet'
        JOIN 'data/address_clusters.parquet' USING (address_id)
    ) TO 'data/clusters.parquet'
""")
```

At Bitcoin scale the one-shot join outgrows the memory budget, so the same query runs in eight slices of the id space, which stretches the step to 24 minutes:

```python
SLICES = 8
for s in range(SLICES):
    con.execute(f"""
        COPY (
            SELECT address, cluster_id
            FROM (SELECT * FROM 'data/address_ids.parquet'
                  WHERE address_id % {SLICES} = {s})
            JOIN (SELECT * FROM 'data/address_clusters.parquet'
                  WHERE address_id % {SLICES} = {s}) USING (address_id)
        ) TO 'data/clusters_{s}.parquet'
    """)
```

That is the entire pipeline. The final Parquet files map each clustered address to its cluster and can be queried with any tool that reads Parquet.

### The numbers

| | |
|---|---|
| Machine | Laptop, Intel i7-1365U, 32 GB RAM |
| Raw transaction table | 831 GB (1.4 billion transactions) |
| Read for clustering | 66.6 GB (8 percent of the table) |
| Reduce to address lists | 2 h 6 min (39 GB on disk) |
| Multi-input transactions | 229.8 million (1.65 billion input references) |
| Distinct input addresses | 963.7 million |
| Address mapping (DuckDB, 16 partitions) | 39 min, 12 GB memory budget |
| Clustering (Union-Find) | 1 min 18 s, 11.7 GB peak RAM |
| Resolving ids back | 24 min |
| Clusters | 116.5 million |

Once the reduced lists exist, the laptop needs about an hour to cluster all of Bitcoin, and the clustering step itself is a footnote within that. We compared the result for consistency with the legacy clustering approach and found no deviations. The largest cluster spans 40.7 million addresses; the Iknaio platform identifies it as the exchange Coinbase. Binance also appears among the five largest clusters.

## Where the limits are

The pipeline above reproduces the multi-input step of the production system, not the whole platform. The Iknaio platform also detects CoinJoins before they can distort clusters, keeps clusters up to date as new blocks arrive, and enriches them with tags, statistics, and cross-chain links. The heuristic itself stays a heuristic. Custodial wallets can merge many users into one cluster, and an actor who never co-spends across addresses stays split.

Beyond the storage that holds the Delta Lake, the run stays well within laptop territory, with around 100 GB of temporary disk space and a 12 GB memory budget. What sets the pace is the throughput to the table's storage and a few hours of processing time.

Cluster-level views of all major chains, kept continuously up to date, are available in the [Iknaio platform](https://app.iknaio.com).

## References

[1] Nakamoto, S. (2008). [Bitcoin: A Peer-to-Peer Electronic Cash System](https://bitcoin.org/bitcoin.pdf).

[2] Fröwis, M., Gottschalk, T., Haslhofer, B., Rückert, C., & Pesch, P. (2020). [Safeguarding the evidential value of forensic cryptocurrency investigations](https://www.sciencedirect.com/science/article/pii/S1742287619302567). Forensic Science International: Digital Investigation, 33.

[3] Müller, L., Elsner, J., Niedermayer, T., Haslhofer, B., Goger, T., Kühl, N., & Rückert, C. (2026). [How Reliable Is the Multi-Input Heuristic for Bitcoin Address Clustering in Law Enforcement Contexts?](https://arxiv.org/pdf/2607.07414). arXiv preprint arXiv:2607.07414.
