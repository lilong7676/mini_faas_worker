import*as e from"../../../core/i18n/i18n.js";import*as t from"../../../ui/components/buttons/buttons.js";import*as r from"../../../ui/components/helpers/helpers.js";import*as i from"../../../ui/components/panel_feedback/panel_feedback.js";import*as o from"../../../ui/lit-html/lit-html.js";const a=new CSSStyleSheet;a.replaceSync("h1{font-weight:400}.css-overview-start-view{padding:24px;height:100%;display:flex;flex-direction:column;background-color:var(--color-background)}.summary-header{color:var(--color-text-primary);font-size:18px;font-weight:400;letter-spacing:.02em;line-height:1.33;margin:0;padding:0}.summary-list{counter-reset:custom-counter;list-style:none;margin:16px 0 30px 30px;padding:0}.summary-list li{color:var(--color-text-primary);counter-increment:custom-counter;font-size:13px;letter-spacing:.03em;line-height:1.54;margin-bottom:9px;position:relative}.summary-list li::before{--override-color-counter-background:rgba(26 115 232 / 25%);box-sizing:border-box;background:var(--override-color-counter-background);border-radius:50%;color:var(--color-primary);content:counter(custom-counter);font-size:12px;height:18px;left:-30px;line-height:20px;position:absolute;text-align:center;top:0;width:18px;display:flex;align-items:center;justify-content:center}.start-capture-wrapper{width:fit-content}.preview-feature{padding:12px 16px;border:1px solid var(--color-details-hairline);color:var(--color-text-primary);font-size:13px;line-height:20px;border-radius:12px;margin:42px 0;letter-spacing:.01em}.preview-header{color:var(--color-primary);font-size:13px;line-height:20px;letter-spacing:.01em;margin:9px 0 14px}.preview-icon{vertical-align:middle}.feedback-prompt{margin-bottom:24px}.feedback-prompt .devtools-link{color:-webkit-link;cursor:pointer;text-decoration:underline}.resources{display:flex;flex-direction:row}.thumbnail-wrapper{width:144px;height:92px;margin-right:20px}.video-doc-header{font-size:13px;line-height:20px;letter-spacing:.04em;color:var(--color-text-primary);margin-bottom:2px}devtools-feedback-button{align-self:flex-end}.resources .devtools-link{font-size:14px;line-height:22px;letter-spacing:.04em;text-decoration-line:underline;color:var(--color-primary)}\n/*# sourceURL=cssOverviewStartView.css */\n");const s={captureOverview:"Capture overview",identifyCSSImprovements:"Identify potential CSS improvements",capturePageCSSOverview:"Capture an overview of your page’s CSS",identifyCSSImprovementsWithExampleIssues:"Identify potential CSS improvements (e.g. low contrast issues, unused declarations, color or font mismatches)",locateAffectedElements:"Locate the affected elements in the Elements panel",quickStartWithCSSOverview:"Quick start: get started with the new CSS Overview panel"},n=e.i18n.registerUIStrings("panels/css_overview/components/CSSOverviewStartView.ts",s),l=e.i18n.getLocalizedString.bind(void 0,n),{render:c,html:p}=o;class d extends Event{static eventName="overviewstartrequested";constructor(){super(d.eventName)}}class m extends HTMLElement{static litTagName=o.literal`devtools-css-overview-start-view`;#e=this.attachShadow({mode:"open"});connectedCallback(){this.#e.adoptedStyleSheets=[a],this.render()}show(){this.classList.remove("hidden")}hide(){this.classList.add("hidden")}onStartCaptureClick(){this.dispatchEvent(new d)}render(){c(p` <div class="css-overview-start-view"> <h1 class="summary-header">${l(s.identifyCSSImprovements)}</h1> <ol class="summary-list"> <li>${l(s.capturePageCSSOverview)}</li> <li>${l(s.identifyCSSImprovementsWithExampleIssues)}</li> <li>${l(s.locateAffectedElements)}</li> </ol> <div class="start-capture-wrapper"> <${t.Button.Button.litTagName} class="start-capture" .variant="${"primary"}" @click="${this.onStartCaptureClick}"> ${l(s.captureOverview)} </${t.Button.Button.litTagName}> </div> <${i.PanelFeedback.PanelFeedback.litTagName} .data="${{feedbackUrl:"https://goo.gle/css-overview-feedback",quickStartUrl:"https://developer.chrome.com/docs/devtools/css-overview",quickStartLinkText:l(s.quickStartWithCSSOverview)}}"> </${i.PanelFeedback.PanelFeedback.litTagName}> <${i.FeedbackButton.FeedbackButton.litTagName} .data="${{feedbackUrl:"https://goo.gle/css-overview-feedback"}}"> </${i.FeedbackButton.FeedbackButton.litTagName}> </div> `,this.#e,{host:this});const e=this.#e.querySelector(".start-capture");e&&e.focus()}}r.CustomElements.defineComponent("devtools-css-overview-start-view",m);var v=Object.freeze({__proto__:null,OverviewStartRequestedEvent:d,CSSOverviewStartView:m});export{v as CSSOverviewStartView};