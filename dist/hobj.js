var t=function(t){return function(){for(var e=[],r=arguments.length;r--;)e[r]=arguments[r];return t.forEach(function(t){return t.apply(void 0,e)})}},e=function(t){return String(t).split(".")};function r(t){return function(e,r){var n=Array.from(this[t+"Q"].get(e)||[]).concat([r]);this[t+"Q"].set(e,n)}}var n={_get:function(t){return e(t).reduce(function(t,e){return t&&t[e]},this.store)},_set:function t(r,n,i,o){void 0===i&&(i=this.store),void 0===o&&(o=null);var s=o||e(r),u=s[0];if(i)return void 0===i[u]&&(i[u]={},1===s.length)?(i[u]=n,this.store):(s.shift(),t(r,n,i[u],s))},_has:function(t){return void 0!==this._get(t)},_delete:function t(r,n,i){void 0===n&&(n=this.store),void 0===i&&(i=null);var o=i||e(r),s=o[0];return void 0!==n[s]&&(1===o.length?(delete n[s],!0):(o.shift(),t(r,n[s],o)))},_clear:function(){this.store={}},_sub:function(t){return JSON.parse(JSON.stringify(t?this._get(t):this.store))},_for:function(t){var e=this;return function(r){var n=e.storeSelect(t);for(var i in n)r(i)}},_keys:function(t){var e=this.storeSelect(t);return Object.keys(e)},_size:function(t){var e=this.storeSelect(t);return Object.keys(e).length},_sizeDeep:function(t,e){void 0===e&&(e=!0);var r=0;return this._forDeep(t,e)(function(){return r+=1}),r},_entries:function(t){var e=this.storeSelect(t);return this._keys(t).map(function(t){return[t,e[t]]})},_forDeep:function(t,e){void 0===t&&(t=""),void 0===e&&(e=!0);var r=this.storeSelect(t);return function(n){if("function"!=typeof n)throw new TypeError("Func must be a function");!function r(i,o){if(void 0===o&&(o=[]),void 0!==i){var s=t+o.join(".");return e?"object"!=typeof i&&n(i,s):n(i,s),Object.keys(i).map(function(t){return r(i[t],o.concat([t]))})}}(r)}}};module.exports=function(e){var i=this;void 0===e&&(e={}),this.store=e,this.beforeQ=new Map,this.afterQ=new Map,this.methods=Object.keys(n).map(function(t){return{pure:t,normal:t.replace("_","")}}),this.methods.forEach(function(t){var e=t.pure;return i[e]=n[e].bind(i)}),this.methods.forEach(function(e){var r,n=e.normal;return i[n]=(r=n,function(){for(var e,n=this,i=[],o=arguments.length;o--;)i[o]=arguments[o];return t(this.beforeQ.get(r)||[]).apply(void 0,i),Promise.resolve().then(function(){return t(n.afterQ.get(r)||[]).apply(void 0,i)}),(e=this)["_"+r].apply(e,i)}).bind(i)}),this.storeSelect=function(t){return void 0===t&&(t=""),""!==t?this._get(t):this.store}.bind(this),this.before=r("before").bind(this),this.after=r("after").bind(this)};
