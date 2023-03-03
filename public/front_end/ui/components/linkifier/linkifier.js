import*as e from"../../lit-html/lit-html.js";import*as t from"../helpers/helpers.js";import*as i from"../render_coordinator/render_coordinator.js";import*as r from"../../../models/bindings/bindings.js";const n=new CSSStyleSheet;n.replaceSync(".link:link,.link:visited{color:var(--color-link);text-decoration:underline;cursor:pointer}\n/*# sourceURL=linkifierImpl.css */\n");const o=i.RenderCoordinator.RenderCoordinator.instance();class s extends Event{data;static eventName="linkifieractivated";constructor(e){super(s.eventName,{bubbles:!0,composed:!0}),this.data=e,this.data=e}}class l extends HTMLElement{static litTagName=e.literal`devtools-linkifier`;#e=this.attachShadow({mode:"open"});#t="";#i;#r;set data(e){if(this.#t=e.url,this.#i=e.lineNumber,this.#r=e.columnNumber,!this.#t)throw new Error("Cannot construct a Linkifier without providing a valid string URL.");this.render()}connectedCallback(){this.#e.adoptedStyleSheets=[n]}onLinkActivation(e){e.preventDefault();const t=new s({url:this.#t,lineNumber:this.#i,columnNumber:this.#r});this.dispatchEvent(t)}async render(){await o.write((()=>{e.render(e.html`<a class="link" href="${this.#t}" @click="${this.onLinkActivation}"><slot>${function(e,t){if(e){let i=`${r.ResourceUtils.displayNameForURL(e)}`;return void 0!==t&&(i+=`:${t+1}`),i}throw new Error("New linkifier component error: don't know how to generate link text for given arguments")}(this.#t,this.#i)}</slot></a>`,this.#e,{host:this})}))}}t.CustomElements.defineComponent("devtools-linkifier",l);var a=Object.freeze({__proto__:null,LinkifierClick:s,Linkifier:l});export{a as Linkifier};