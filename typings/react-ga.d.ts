// Project: https://github.com/react-ga/react-ga
// Definitions by: Lennard Schutter <https://github.com/lennardschutter>

///<reference path='../react/react.d.ts' />

declare namespace GaComponent {
    import React = __React;
    interface GaProps {
    }

    interface IEventArgsProps {
        category: string;
        action: string;
        label?: string;
        value?: number;
        nonInteraction?: boolean;
    }

    interface IInitializeOptionsProps {
        debug?: boolean;
        titleCase?: boolean;
        gaOptions?: Object;
    }

    function initialize(gaTrackingId: string, options?: IInitializeOptionsProps);
    function set(fieldsObject: Object);
    function pageview(path: string);
    function modalview(modalName: string);
    function event(args: IEventArgsProps);
    function outboundLink(args: Object, hitCallback?: Function);
    function exception(description?: string, fatal?: string);

    interface IPluginFunctions {
        require: (name: string, options?: Object) => void;
        execute: (pluginName: string, action: string, actionType?: any, payload?: any) => void;
    }
    var plugin: IPluginFunctions;

    interface OutboundLinkProps extends React.HTMLAttributes, React.Props<OutboundLink> {
        eventLabel: string;
        to: string;
        target?: string;
    }
    interface OutboundLink extends React.ComponentClass<OutboundLinkProps> { }
    interface OutboundLinkElement extends React.ReactElement<OutboundLinkProps> { }
    const OutboundLink: OutboundLink;
}

declare module "react-ga" {
    const ga: typeof GaComponent;
    export = ga;
}
