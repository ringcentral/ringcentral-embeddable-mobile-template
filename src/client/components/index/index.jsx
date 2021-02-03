import { Component } from 'react'
import {
  getUrl,
  login
} from '../../app/event-handler'
import { wait } from '../../app/common'
import extra from '../../extra'

export default class App extends Component {
  state = {
    loggedIn: false,
    fetchingUser: false,
    loginning: false
  }

  isIOS = window.rc.isIOS

  componentDidMount () {
    console.log('isios', this.isIOS)
    this.initEvent()
    if (!this.isIOS) {
      this.requirePermissions()
    }
    extra()
  }

  postMessage = (data) => {
    document.getElementById('rc-widget-adapter-frame').contentWindow.postMessage(data, '*')
  }

  waitUntilLoad = async () => {
    let inited = false
    while (!inited) {
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.permissions) {
        inited = true
      } else {
        await wait(50)
      }
    }
    return true
  }

  requirePermissions = async () => {
    await this.waitUntilLoad()
    try {
      const { permissions } = cordova.plugins
      const list = [
        permissions.CAPTURE_AUDIO_OUTPUT,
        permissions.RECORD_AUDIO
      ]
      permissions.checkPermission(list, (status) => {
        console.log('permission list', status)
        if (!status.hasPermission) {
          permissions.requestPermissions(
            list,
            (status) => {
              if (!status.hasPermission) {
                console.log('set permission failed')
              }
            },
            console.log
          )
        }
      }, null)
    } catch (e) {
      console.log(e)
    }
  }

  initEvent = () => {
    if (typeof cordova !== 'undefined') {
      window.open = cordova.InAppBrowser.open
    }
    window.addEventListener('message', this.onEvent)
  }

  login = () => {
    setTimeout(() => {
      login(this.postMessage)
    }, 100)
  }

  onEvent = e => {
    const { data } = e
    console.debug('got data from ev', data)
    if (data) {
      switch (data.type) {
        case 'rc-login-popup-notify':
          // get login oAuthUri from widget
          console.log('rc-login-popup-notify:', data.oAuthUri)
          window.location.href = getUrl()
          //  window.open(data.oAuthUri); // open oauth uri to login
          break
        case 'rc-adapter-pushAdapterState':
          this.login()
          break
        default:
          break
      }
    }
  }

  render () {
    const url = this.isIOS
      ? window.rc.server + '/embeddable/app.html' + window.rc.appConfigQuery
      : 'https://ringcentral.github.io/ringcentral-embeddable/app.html' + window.rc.appConfigQuery
    return (
      <div id='app'>
        <iframe
          id='rc-widget-adapter-frame'
          src={url}
          sandbox='allow-same-origin allow-scripts allow-forms allow-popups'
          allow='microphone'
        />
      </div>
    )
  }
}
