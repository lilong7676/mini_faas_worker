import*as e from"../../core/common/common.js";import*as t from"../../core/platform/platform.js";import*as r from"../../core/sdk/sdk.js";import*as o from"../bindings/bindings.js";import*as n from"../text_utils/text_utils.js";import*as i from"../workspace/workspace.js";const s=Math.min(2,navigator.hardwareConcurrency-1);let a;class c{taskQueue;workerTasks;constructor(){this.taskQueue=[],this.workerTasks=new Map}static instance(){return a||(a=new c),a}createWorker(){const t=e.Worker.WorkerWrapper.fromURL(new URL("../../entrypoints/formatter_worker/formatter_worker-entrypoint.js",import.meta.url));return t.onmessage=this.onWorkerMessage.bind(this,t),t.onerror=this.onWorkerError.bind(this,t),t}processNextTask(){if(!this.taskQueue.length)return;let e=[...this.workerTasks.keys()].find((e=>!this.workerTasks.get(e)));if(!e&&this.workerTasks.size<s&&(e=this.createWorker()),!e)return;const t=this.taskQueue.shift();t&&(this.workerTasks.set(e,t),e.postMessage({method:t.method,params:t.params}))}onWorkerMessage(e,t){const r=this.workerTasks.get(e);r&&(r.isChunked&&t.data&&!t.data.isLastChunk?r.callback(t.data):(this.workerTasks.set(e,null),this.processNextTask(),r.callback(t.data?t.data:null)))}onWorkerError(e,t){console.error(t);const r=this.workerTasks.get(e);e.terminate(),this.workerTasks.delete(e);const o=this.createWorker();this.workerTasks.set(o,null),this.processNextTask(),r&&r.callback(null)}runChunkedTask(e,t,r){const o=new u(e,t,(function(e){if(!e)return void r(!0,null);const t="isLastChunk"in e&&Boolean(e.isLastChunk),o="chunk"in e&&e.chunk;r(t,o)}),!0);this.taskQueue.push(o),this.processNextTask()}runTask(e,t){return new Promise((r=>{const o=new u(e,t,r,!1);this.taskQueue.push(o),this.processNextTask()}))}format(e,t,r){const o={mimeType:e,content:t,indentString:r};return this.runTask("format",o)}javaScriptIdentifiers(e){return this.runTask("javaScriptIdentifiers",{content:e}).then((e=>e||[]))}evaluatableJavaScriptSubstring(e){return this.runTask("evaluatableJavaScriptSubstring",{content:e}).then((e=>e||""))}parseCSS(e,t){this.runChunkedTask("parseCSS",{content:e},(function(e,r){t(e,r||[])}))}outlineForMimetype(e,t,r){switch(t){case"text/html":return this.runChunkedTask("htmlOutline",{content:e},r),!0;case"text/javascript":return this.runChunkedTask("javaScriptOutline",{content:e},r),!0;case"text/css":return this.parseCSS(e,(function(e,t){r(e,t.map((e=>{const t="selectorText"in e?e.selectorText:e.atRule;return{line:e.lineNumber,subtitle:void 0,column:e.columnNumber,title:t}})))})),!0}return!1}argumentsList(e){return this.runTask("argumentsList",{content:e})}}class u{method;params;callback;isChunked;constructor(e,t,r,o){this.method=e,this.params=t,this.callback=r,this.isChunked=o}}function d(){return c.instance()}var p=Object.freeze({__proto__:null,FormatterWorkerPool:c,formatterWorkerPool:d});function l(e,t,r){return(t?e[t-1]+1:0)+r}function m(e,r){const o=t.ArrayUtilities.upperBound(e,r-1,t.ArrayUtilities.DEFAULT_COMPARATOR);let n;return n=o?r-e[o-1]-1:r,[o,n]}async function g(t,r,o,n=e.Settings.Settings.instance().moduleSetting("textEditorIndent").get()){return t.isDocumentOrScriptOrStyleSheet()?h(r,o,n):{formattedContent:o,formattedMapping:new S}}async function h(r,o,n=e.Settings.Settings.instance().moduleSetting("textEditorIndent").get()){const i=o.replace(/\r\n?|[\n\u2028\u2029]/g,"\n").replace(/^\uFEFF/,""),s=d(),a=await s.format(r,i,n),c=t.StringUtilities.findLineEndingIndexes(i),u=t.StringUtilities.findLineEndingIndexes(a.content),p=new f(c,u,a.mapping);return{formattedContent:a.content,formattedMapping:p}}class S{originalToFormatted(e,t=0){return[e,t]}formattedToOriginal(e,t=0){return[e,t]}}class f{originalLineEndings;formattedLineEndings;mapping;constructor(e,t,r){this.originalLineEndings=e,this.formattedLineEndings=t,this.mapping=r}originalToFormatted(e,t){const r=l(this.originalLineEndings,e,t||0),o=this.convertPosition(this.mapping.original,this.mapping.formatted,r);return m(this.formattedLineEndings,o)}formattedToOriginal(e,t){const r=l(this.formattedLineEndings,e,t||0),o=this.convertPosition(this.mapping.formatted,this.mapping.original,r);return m(this.originalLineEndings,o)}convertPosition(e,r,o){const n=t.ArrayUtilities.upperBound(e,o,t.ArrayUtilities.DEFAULT_COMPARATOR)-1;let i=r[n]+o-e[n];return n<r.length-1&&i>r[n+1]&&(i=r[n+1]),i}}var k=Object.freeze({__proto__:null,format:g,formatScriptContent:h});const C=new WeakMap;class T{originalSourceCode;formattedSourceCode;mapping;constructor(e,t,r){this.originalSourceCode=e,this.formattedSourceCode=t,this.mapping=r}originalPath(){return this.originalSourceCode.project().id()+":"+this.originalSourceCode.url()}static for(e){return C.get(e)||null}}let w=null;class y{projectId;project;formattedSourceCodes;scriptMapping;styleMapping;constructor(){this.projectId="formatter:",this.project=new o.ContentProviderBasedProject.ContentProviderBasedProject(i.Workspace.WorkspaceImpl.instance(),this.projectId,i.Workspace.projectTypes.Formatter,"formatter",!0),this.formattedSourceCodes=new Map,this.scriptMapping=new L,this.styleMapping=new M,i.Workspace.WorkspaceImpl.instance().addEventListener(i.Workspace.Events.UISourceCodeRemoved,(e=>{this.onUISourceCodeRemoved(e)}),this)}static instance({forceNew:e=!1}={}){return w&&!e||(w=new y),w}async onUISourceCodeRemoved(e){const t=e.data,r=this.formattedSourceCodes.get(t);r&&r.formatData&&await this.discardFormatData(r.formatData),this.formattedSourceCodes.delete(t)}async discardFormattedUISourceCode(e){const t=T.for(e);return t?(await this.discardFormatData(t),this.formattedSourceCodes.delete(t.originalSourceCode),t.originalSourceCode):null}async discardFormatData(e){C.delete(e.formattedSourceCode),await this.scriptMapping.setSourceMappingEnabled(e,!1),this.styleMapping.setSourceMappingEnabled(e,!1),this.project.removeFile(e.formattedSourceCode.url())}hasFormatted(e){return this.formattedSourceCodes.has(e)}getOriginalUISourceCode(e){const t=C.get(e);return t?t.originalSourceCode:e}async format(e){const t=this.formattedSourceCodes.get(e);if(t)return t.promise;const r=new Promise((async(t,o)=>{const{content:i}=await e.requestContent();try{const{formattedContent:o,formattedMapping:s}=await g(e.contentType(),e.mimeType(),i||""),a=this.formattedSourceCodes.get(e);if(!a||a.promise!==r)return;let c,u=0,d="";do{c=`${e.url()}:formatted${d}`,d=":"+u++}while(this.project.uiSourceCodeForURL(c));const p=n.StaticContentProvider.StaticContentProvider.fromString(c,e.contentType(),o),l=this.project.createUISourceCode(c,p.contentType()),m=new T(e,l,s);C.set(l,m),this.project.addUISourceCodeWithProvider(l,p,null,e.mimeType()),await this.scriptMapping.setSourceMappingEnabled(m,!0),await this.styleMapping.setSourceMappingEnabled(m,!0),a.formatData=m,t(m)}catch(e){o(e)}}));return this.formattedSourceCodes.set(e,{promise:r,formatData:null}),r}}class L{constructor(){o.DebuggerWorkspaceBinding.DebuggerWorkspaceBinding.instance().addSourceMapping(this)}rawLocationToUILocation(e){const t=e.script(),r=t&&T.for(t);if(!r||!t)return null;const[o,n]=r.mapping.originalToFormatted(e.lineNumber,e.columnNumber||0);return r.formattedSourceCode.uiLocation(o,n)}uiLocationToRawLocations(t,n,i){const s=T.for(t);if(!s)return[];const[a,c]=s.mapping.formattedToOriginal(n,i);if(s.originalSourceCode.contentType().isScript()){const e=o.DebuggerWorkspaceBinding.DebuggerWorkspaceBinding.instance().uiLocationToRawLocationsForUnformattedJavaScript(s.originalSourceCode,a,c);return console.assert(e.every((e=>e&&Boolean(e.script())))),e}if(s.originalSourceCode.contentType()===e.ResourceType.resourceTypes.Document){const e=o.NetworkProject.NetworkProject.targetForUISourceCode(s.originalSourceCode),t=e&&e.model(r.DebuggerModel.DebuggerModel);if(t){const e=t.scriptsForSourceURL(s.originalSourceCode.url()).filter((e=>e.isInlineScript()&&!e.hasSourceURL)).map((e=>e.rawLocation(a,c))).filter((e=>Boolean(e)));return console.assert(e.every((e=>e&&Boolean(e.script())))),e}}return[]}async setSourceMappingEnabled(e,t){const r=this.scriptsForUISourceCode(e.originalSourceCode);if(!r.length)return;if(t)for(const t of r)C.set(t,e);else for(const e of r)C.delete(e);const n=r.map((e=>o.DebuggerWorkspaceBinding.DebuggerWorkspaceBinding.instance().updateLocations(e)));await Promise.all(n)}scriptsForUISourceCode(t){if(t.contentType()===e.ResourceType.resourceTypes.Document){const e=o.NetworkProject.NetworkProject.targetForUISourceCode(t),n=e&&e.model(r.DebuggerModel.DebuggerModel);if(n){return n.scriptsForSourceURL(t.url()).filter((e=>e.isInlineScript()&&!e.hasSourceURL))}}if(t.contentType().isScript()){console.assert(!C.has(t));return o.DebuggerWorkspaceBinding.DebuggerWorkspaceBinding.instance().uiLocationToRawLocationsForUnformattedJavaScript(t,0,0).map((e=>e.script())).filter((e=>Boolean(e)))}return[]}}const b=new WeakMap;class M{headersSymbol;constructor(){o.CSSWorkspaceBinding.CSSWorkspaceBinding.instance().addSourceMapping(this),this.headersSymbol=Symbol("Formatter.SourceFormatter.StyleMapping._headersSymbol")}rawLocationToUILocation(e){const t=e.header(),r=t&&T.for(t);if(!r)return null;const o=r.mapping.originalToFormatted(e.lineNumber,e.columnNumber||0);return r.formattedSourceCode.uiLocation(o[0],o[1])}uiLocationToRawLocations(e){const t=T.for(e.uiSourceCode);if(!t)return[];const[o,n]=t.mapping.formattedToOriginal(e.lineNumber,e.columnNumber),i=b.get(t.originalSourceCode);if(!i)return[];return i.filter((e=>e.containsLocation(o,n))).map((e=>new r.CSSModel.CSSLocation(e,o,n)))}async setSourceMappingEnabled(e,t){const r=e.originalSourceCode,n=this.headersForUISourceCode(r);t?(b.set(r,n),n.forEach((t=>{C.set(t,e)}))):(b.delete(r),n.forEach((e=>{C.delete(e)})));const i=n.map((e=>o.CSSWorkspaceBinding.CSSWorkspaceBinding.instance().updateLocations(e)));await Promise.all(i)}headersForUISourceCode(t){if(t.contentType()===e.ResourceType.resourceTypes.Document){const e=o.NetworkProject.NetworkProject.targetForUISourceCode(t),n=e&&e.model(r.CSSModel.CSSModel);if(n)return n.headersForSourceURL(t.url()).filter((e=>e.isInline&&!e.hasSourceURL))}else if(t.contentType().isStyleSheet()){return o.CSSWorkspaceBinding.CSSWorkspaceBinding.instance().uiLocationToRawLocations(t.uiLocation(0,0)).map((e=>e.header())).filter((e=>Boolean(e)))}return[]}}var F=Object.freeze({__proto__:null,SourceFormatData:T,SourceFormatter:y});export{p as FormatterWorkerPool,k as ScriptFormatter,F as SourceFormatter};