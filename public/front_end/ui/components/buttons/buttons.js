import*as o from"../../lit-html/lit-html.js";import*as t from"../helpers/helpers.js";import*as r from"../icon_button/icon_button.js";const e=new CSSStyleSheet;e.replaceSync("*{margin:0;padding:0;box-sizing:border-box}:focus,:focus-visible,:host(:focus),:host(:focus-visible){outline:0}:host{display:inline-flex;flex-direction:row}button{align-items:center;border-radius:4px;display:inline-flex;font-family:inherit;font-size:12px;font-weight:500;height:24px;line-height:14px;padding:5px 12px;justify-content:center;width:100%}button.small{height:18px;border-radius:2px}button:focus-visible{box-shadow:0 0 0 2px var(--color-button-outline-focus)}button:hover{cursor:pointer}button.toolbar{background:0 0;border-radius:2px;border:none;height:24px;width:24px;overflow:hidden;padding:0;white-space:nowrap}button.toolbar.small{height:18px;width:18px}button.primary{border:1px solid var(--color-primary);background:var(--color-primary);color:var(--color-background)}button.primary:hover{background:var(--color-button-primary-background-hovering);border:1px solid var(--color-button-primary-background-hovering)}button.primary.active,button.primary:active{background:var(--color-button-primary-background-pressed);border:1px solid var(--color-button-primary-background-pressed)}button.primary:disabled,button.primary:disabled:hover{border:1px solid transparent;background:var(--color-background-elevation-1);color:var(--color-text-disabled);cursor:not-allowed}button.secondary{border:1px solid var(--color-details-hairline);background:var(--color-background);color:var(--color-primary)}button.secondary:hover{background:var(--color-button-secondary-background-hovering)}button.secondary.active,button.secondary:active{background:var(--color-button-secondary-background-pressed);border:1px solid var(--color-button-secondary-background-pressed)}button.secondary:focus-visible{border:1px solid var(--color-background)}button.secondary:disabled,button.secondary:disabled:hover{border:1px solid var(--color-background-elevation-1);background:var(--color-background);color:var(--color-text-disabled);cursor:not-allowed}button.secondary.active:focus-visible,button.secondary:active:focus-visible{border:1px solid var(--color-button-secondary-background-pressed)}button.toolbar:hover{background-color:var(--color-button-secondary-background-hovering)}button.toolbar.active,button.toolbar:active{background-color:var(--color-button-secondary-background-pressed)}button.toolbar:focus-visible{background-color:var(--color-background-elevation-2)}button.toolbar:disabled,button.toolbar:disabled:hover{border:1px solid transparent;background:var(--color-background);color:var(--color-text-disabled);cursor:not-allowed}button.text-with-icon{padding:0 12px 0 4px}button.small.text-with-icon{padding:0 9px 0 3px}button.only-icon{padding:0}button devtools-icon{width:19px;height:19px}button.toolbar devtools-icon{width:24px;height:24px;--icon-color:var(--color-text-primary)}button.primary devtools-icon{--icon-color:var(--color-background)}button.secondary devtools-icon{--icon-color:var(--color-primary)}button.small devtools-icon{width:14px;height:14px}button.toolbar.small devtools-icon{width:18px;height:18px}button.toolbar:disabled devtools-icon{--icon-color:var(--color-text-disabled)}button.primary:disabled devtools-icon{--icon-color:var(--color-text-disabled)}button.secondary:disabled devtools-icon{--icon-color:var(--color-text-disabled)}.spinner-component.secondary{border:2px solid var(--color-primary);border-right-color:transparent}.spinner-component.disabled{border:2px solid var(--color-text-disabled);border-right-color:transparent}.spinner-component{display:block;width:12px;height:12px;border-radius:6px;border:2px solid var(--color-background);animation:spinner-animation 1s linear infinite;border-right-color:transparent;margin-right:6px}@keyframes spinner-animation{from{transform:rotate(0)}to{transform:rotate(360deg)}}\n/*# sourceURL=button.css */\n");class i extends HTMLElement{static formAssociated=!0;static litTagName=o.literal`devtools-button`;#o=this.attachShadow({mode:"open",delegatesFocus:!0});#t=this.render.bind(this);#r=this.onClick.bind(this);#e={size:"MEDIUM",disabled:!1,active:!1,spinner:!1,type:"button"};#i=!0;#n=this.attachInternals();constructor(){super(),this.setAttribute("role","presentation"),this.addEventListener("click",this.#r,!0)}set data(o){this.#e.variant=o.variant,this.#e.iconUrl=o.iconUrl,this.#e.size=o.size||"MEDIUM",this.#e.active=Boolean(o.active),this.#e.spinner=Boolean(o.spinner),this.#e.type=o.type||"button",this.setDisabledProperty(o.disabled||!1),t.ScheduledRender.scheduleRender(this,this.#t)}set iconUrl(o){this.#e.iconUrl=o,t.ScheduledRender.scheduleRender(this,this.#t)}set variant(o){this.#e.variant=o,t.ScheduledRender.scheduleRender(this,this.#t)}set size(o){this.#e.size=o,t.ScheduledRender.scheduleRender(this,this.#t)}set type(o){this.#e.type=o,t.ScheduledRender.scheduleRender(this,this.#t)}set disabled(o){this.setDisabledProperty(o),t.ScheduledRender.scheduleRender(this,this.#t)}set active(o){this.#e.active=o,t.ScheduledRender.scheduleRender(this,this.#t)}set spinner(o){this.#e.spinner=o,t.ScheduledRender.scheduleRender(this,this.#t)}setDisabledProperty(o){this.#e.disabled=o,this.toggleAttribute("disabled",o)}focus(){this.#o.querySelector("button")?.focus()}connectedCallback(){this.#o.adoptedStyleSheets=[e],t.ScheduledRender.scheduleRender(this,this.#t)}onClick(o){if(this.#e.disabled)return o.stopPropagation(),void o.preventDefault();this.form&&"submit"===this.#e.type&&(o.preventDefault(),this.form.dispatchEvent(new SubmitEvent("submit",{submitter:this}))),this.form&&"reset"===this.#e.type&&(o.preventDefault(),this.form.reset())}onSlotChange(o){const r=o.target?.assignedNodes();this.#i=!r||!Boolean(r.length),t.ScheduledRender.scheduleRender(this,this.#t)}render(){if(!this.#e.variant)throw new Error("Button requires a variant to be defined");if("toolbar"===this.#e.variant){if(!this.#e.iconUrl)throw new Error("Toolbar button requires an icon");if(!this.#i)throw new Error("Tooblar button does not accept children")}const t={primary:"primary"===this.#e.variant,secondary:"secondary"===this.#e.variant,toolbar:"toolbar"===this.#e.variant,"text-with-icon":Boolean(this.#e.iconUrl)&&!this.#i,"only-icon":Boolean(this.#e.iconUrl)&&this.#i,small:Boolean("SMALL"===this.#e.size),active:this.#e.active},e={primary:"primary"===this.#e.variant,secondary:"secondary"===this.#e.variant,disabled:Boolean(this.#e.disabled),"spinner-component":!0};o.render(o.html` <button .disabled="${this.#e.disabled}" class="${o.Directives.classMap(t)}"> ${this.#e.iconUrl?o.html`<${r.Icon.Icon.litTagName} .data="${{iconPath:this.#e.iconUrl,color:"var(--color-background)"}}"> </${r.Icon.Icon.litTagName}>`:""} ${this.#e.spinner?o.html`<span class="${o.Directives.classMap(e)}"></span>`:""} <slot @slotchange="${this.onSlotChange}"></slot> </button> `,this.#o,{host:this})}get value(){return this.#e.value||""}set value(o){this.#e.value=o}get form(){return this.#n.form}get name(){return this.getAttribute("name")}get type(){return this.#e.type}get validity(){return this.#n.validity}get validationMessage(){return this.#n.validationMessage}get willValidate(){return this.#n.willValidate}checkValidity(){return this.#n.checkValidity()}reportValidity(){return this.#n.reportValidity()}}t.CustomElements.defineComponent("devtools-button",i);var n=Object.freeze({__proto__:null,Button:i});export{n as Button};