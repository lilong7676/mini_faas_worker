import*as e from"../../core/common/common.js";import*as t from"../../core/sdk/sdk.js";import*as a from"../../ui/legacy/legacy.js";import*as i from"../../core/i18n/i18n.js";const o={application:"Application",showApplication:"Show Application",pwa:"pwa",clearSiteData:"Clear site data",clearSiteDataIncludingThirdparty:"Clear site data (including third-party cookies)",startRecordingEvents:"Start recording events",stopRecordingEvents:"Stop recording events"},n=i.i18n.registerUIStrings("panels/application/application-meta.ts",o),r=i.i18n.getLazilyComputedLocalizedString.bind(void 0,n);let c;async function s(){return c||(c=await import("./application.js")),c}a.ViewManager.registerViewExtension({location:"panel",id:"resources",title:r(o.application),commandPrompt:r(o.showApplication),order:70,loadView:async()=>(await s()).ResourcesPanel.ResourcesPanel.instance(),tags:[r(o.pwa)]}),a.ActionRegistration.registerActionExtension({category:a.ActionRegistration.ActionCategory.RESOURCES,actionId:"resources.clear",title:r(o.clearSiteData),loadActionDelegate:async()=>(await s()).StorageView.ActionDelegate.instance()}),a.ActionRegistration.registerActionExtension({category:a.ActionRegistration.ActionCategory.RESOURCES,actionId:"resources.clear-incl-third-party-cookies",title:r(o.clearSiteDataIncludingThirdparty),loadActionDelegate:async()=>(await s()).StorageView.ActionDelegate.instance()}),a.ActionRegistration.registerActionExtension({actionId:"background-service.toggle-recording",iconClass:"largeicon-start-recording",toggleable:!0,toggledIconClass:"largeicon-stop-recording",toggleWithRedColor:!0,contextTypes(){return e=e=>[e.BackgroundServiceView.BackgroundServiceView],void 0===c?[]:e(c);var e},loadActionDelegate:async()=>(await s()).BackgroundServiceView.ActionDelegate.instance(),category:a.ActionRegistration.ActionCategory.BACKGROUND_SERVICES,options:[{value:!0,title:r(o.startRecordingEvents)},{value:!1,title:r(o.stopRecordingEvents)}],bindings:[{platform:"windows,linux",shortcut:"Ctrl+E"},{platform:"mac",shortcut:"Meta+E"}]}),e.Revealer.registerRevealer({contextTypes:()=>[t.Resource.Resource],destination:e.Revealer.RevealerDestination.APPLICATION_PANEL,loadRevealer:async()=>(await s()).ResourcesPanel.ResourceRevealer.instance()}),e.Revealer.registerRevealer({contextTypes:()=>[t.Cookie.CookieReference],destination:e.Revealer.RevealerDestination.APPLICATION_PANEL,loadRevealer:async()=>(await s()).ResourcesPanel.CookieReferenceRevealer.instance()}),e.Revealer.registerRevealer({contextTypes:()=>[t.ResourceTreeModel.ResourceTreeFrame],destination:e.Revealer.RevealerDestination.APPLICATION_PANEL,loadRevealer:async()=>(await s()).ResourcesPanel.FrameDetailsRevealer.instance()});