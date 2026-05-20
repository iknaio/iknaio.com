HUGO ?= hugo

.PHONY: serve serve-drafts build clean

serve:
	$(HUGO) server

serve-drafts:
	$(HUGO) server -D

build:
	$(HUGO)

clean:
	rm -rf public resources
