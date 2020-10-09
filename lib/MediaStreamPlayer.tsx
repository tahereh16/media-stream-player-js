import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { Format, Player } from './Player'

interface InitialAttributes {
  readonly hostname: string
  readonly autoplay: boolean
  readonly format: string
}

type SetStateType = React.Dispatch<React.SetStateAction<InitialAttributes>>

/**
 * Create a custom element that uses React to mount the actual Player component.
 *
 * Note that this does not use a shadow DOM to avoid certain issues with React.
 */
export class MediaStreamPlayer extends HTMLElement {
  private _setState?: SetStateType

  public attributeChangeSubscriber(cb: SetStateType) {
    this._setState = cb
  }

  public static get observedAttributes() {
    return ['hostname', 'autoplay', 'format']
  }

  public get hostname() {
    return this.getAttribute('hostname') ?? ''
  }

  public set hostname(value: string) {
    this.setAttribute('hostname', value)
  }

  public get autoplay() {
    return this.hasAttribute('autoplay')
  }

  public set autoplay(value) {
    if (value !== undefined) {
      this.setAttribute('autoplay', '')
    } else {
      this.removeAttribute('autoplay')
    }
  }

  public get format() {
    return this.getAttribute('format') ?? 'JPEG'
  }

  public set format(value: string) {
    this.setAttribute('format', value)
  }

  public connectedCallback() {
    window
      .fetch(`http://${this.hostname}/axis-cgi/usergroup.cgi`, {
        credentials: 'include',
        mode: 'no-cors',
      })
      .then(() => {
        const { hostname, autoplay, format } = this

        ReactDOM.render(
          <PlayerComponent
            // eslint-disable-next-line react/jsx-no-bind
            subscribeAttributesChanged={(cb) =>
              this.attributeChangeSubscriber(cb)
            }
            initialAttributes={{
              hostname,
              autoplay,
              format,
            }}
          />,
          this,
        )
      })
      .catch((err) => {
        console.error(`Authorization failed: ${err.message}`)
      })
  }

  public disconnectedCallback() {
    ReactDOM.unmountComponentAtNode(this)
  }

  public attributeChangedCallback(attrName: string, _: string, value: string) {
    if (this._setState === undefined) {
      console.warn(`ignored attribute change: ${attrName}=${value}`)
      return
    }

    const { hostname, autoplay, format } = this
    this._setState({
      hostname,
      autoplay,
      format,
    })
  }
}

interface PlayerComponentProps {
  readonly initialAttributes: InitialAttributes
  readonly subscribeAttributesChanged: (cb: SetStateType) => void
}

const PlayerComponent: React.FC<PlayerComponentProps> = ({
  subscribeAttributesChanged,
  initialAttributes,
}) => {
  const [state, setState] = useState(initialAttributes)

  useEffect(() => {
    subscribeAttributesChanged(setState)
  }, [subscribeAttributesChanged])

  const { hostname, autoplay, format } = state

  return (
    <Player hostname={hostname} autoPlay={autoplay} format={format as Format} />
  )
}
