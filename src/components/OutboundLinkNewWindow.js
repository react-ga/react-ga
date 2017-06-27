/* Adapted from https://github.com/react-ga/react-ga/issues/118 */
import React, { Component } from 'react'
import ReactGA from 'react-ga'

export default class OutLinkNewWindow extends Component {
  render () {
    const handleOutbound = eventLabel => {
      ReactGA.event({
        category: 'Outbound',
        action: 'click',
        label: eventLabel
      })
    }

    const { children, to, label, ...restProps } = this.props
    return (
      <a
        {...restProps}
        href={to}
        target='_blank'
        onClick={() => handleOutbound(label)}
      >
        {children}
      </a>
    )
  }
}
