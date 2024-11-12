# Chain library

## Install

Add to `package.json`:

```json
{
  "dependencies": {
    "@rees46/chain-library": "latest"
  }
}
```

And run `yarn`.

## Dev

Run `yarn dev` and open [http://localhost:8080](http://localhost:8080)

## How to use

Add global container to your page for make rules tree:

```html
<div class="r-chain-rules module-right-2">
	<div id="chain_rules_container"></div>
</div>
```

Add sidebar for editor:

```html
<div class="r-modal-conditions">
	<h3 class="r-modal-title"></h3>
	<div class="r-modal-body"></div>
	<div class="r-modal-footer">
		<button class="r-submit">Ok</button>
	</div>
</div>
```

```javascript
const API_KEY = 'KEY';
const API_HOST = 'HOST';
let rules = new ChainRules(CHAIN_ID, '#chain_rules_container', '.r-modal-conditions');
```
