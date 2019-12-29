import {inject, observer} from "mobx-react";
import React from 'react';

@inject('SystemMessageStore')
@observer
class SystemMessages extends React.Component {
  destroyer = false;

  onClick = (index) => {
    console.log('on click', index);
    // this.props.hideMessage()
    // let messages = this.state.messages;
    // messages.splice(index, 1);
    // if (!messages.length) {
    //   clearTimeout(this.destroyer);
    //   this.destroyer = false;
    // }
    // this.setState({
    //   messages: messages
    // });
  };

  delayedRemove = () => {
    // if (!this.destroyer)
    //   this.destroyer = setTimeout(() => {
    //     this.setState({
    //       messages: false
    //     });
    //     // let messages = this.state.messages;
    //     // messages.pop();
    //     // this.setState({
    //     //   messages: messages
    //     // });
    //     // clearTimeout(this.destroyer);
    //     // this.destroyer = false;
    //     // if (messages.length)
    //     //   this.delayedRemove();
    //   }, 4000)
  };

  render() {
    const messages = this.props.SystemMessageStore.news;
    // const errors = (this.props.system && this.props.system.error) || [];
    // const success = this.props.system && this.props.system.message;

    console.log('SystemMessages', {messages});

    // if (errors || success) {
    //   const message = errors ? {type: 'error', ...errors} : {type: 'success', ...success};
    //   messages.push(message);
    // }
    return (
      <div id="systemMessages">{
        messages.map((message, key) => {
          const className = 'alert-danger'//message.type === 'error' ? 'alert-danger' : 'alert-success';
          return <div key={key}
                      className={"system-messages col-sm-12 col-md-6 col-lg-5 mx-auto alert alert-dismissible show "
                      + className}>
            <i className="fa fa-exclamation-triangle mr-2"/>
            <strong>{message.code}:</strong> {message.message}
            <button type="button" className="close" data-dismiss="alert" aria-label="Close"
                    onClick={() => {
                      message.hide()
                    }}>
              <span aria-hidden="true">&times;</span>
            </button>
            {message.hideTimeout()}
          </div>
        })}
      </div>
    );
  }
}

export default SystemMessages
