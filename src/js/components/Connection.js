// @flow
import React from 'react'
import { connect } from 'react-redux'
import browserHistory from '../modules/browser-history'
import ConnectionHeader from './ConnectionHeader'
import ConversationList from './ConversationList'
import JoinChannel from './JoinChannel'
import Channel from './channel'
import {
  getConnectionById,
  getConversationByName
} from '../reducers/selectors'
import {
  commandJoin
} from '../actions'
import type {
  Dispatch,
  ConnectionT,
  ConversationT
} from '../flow'

type Props = {
  dispatch: Dispatch,
  connection: ConnectionT,
  conversation: ConversationT
}

class Connection extends React.Component<Props> {
  componentWillMount () {
    if (!this.props.connection) {
      browserHistory.replace('/')
    }
  }

  viewConversation (name) {
    const dest = [
      'connection',
      this.props.connection.id,
      'conversation',
      encodeURIComponent(name)
    ].map(v => '/' + v).join('')

    browserHistory.push(dest)
  }

  render () {
    const {
      connection,
      conversation,
      dispatch
    } = this.props

    return (
      <div className="message-center">
        <div className="left-panel">
          <ConnectionHeader
            connection={connection}
          />
          <div className="below-header scrolling-panel">
            <ConversationList
              connectionId={connection.id}
              onSelectConversation={name => {
                this.viewConversation(name)
              }}
              selectedConversationId={conversation.name}
            />
            {connection.isWelcome ? (
              <JoinChannel onJoin={name => {
                dispatch(commandJoin(connection.id, name))
                this.viewConversation(name)
              }} />
            ) : null}
          </div>
        </div>
        <Channel conversation={conversation} />
      </div>
    )
  }
}

export default connect((state, ownProps) => {
  const { connectionId, conversationId } = ownProps.params

  const connection = getConnectionById(state, connectionId)
  const conversation = getConversationByName(state, conversationId || connectionId)

  return {
    connection,
    conversation,
    pathname: ownProps.location.pathname
  }
})(Connection)
