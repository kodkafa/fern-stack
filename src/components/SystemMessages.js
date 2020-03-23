import {inject, observer} from "mobx-react";
import React from 'react';

export const SystemMessages = inject('SystemMessageStore')(observer((props) => {

  const messages = props.SystemMessageStore.news;

  return (
    <div id="systemMessages">{
      messages.map((message, key) => {
        const className = message.status >= 400
          ? 'alert-danger' : message.status >= 300
            ? 'alert-warning' : message.status >= 200
              ? 'alert-success' : 'alert-info';
        return <div key={key}
                    className={"system-messages col-sm-12 col-md-6 col-lg-5 mx-auto alert alert-dismissible show "
                    + className}>
          <i className="fa fa-exclamation-triangle mr-2"/>
          <strong>{message.code}: </strong>
          {/*<span dangerouslySetInnerHTML={{__html: message.message}}/>*/}
          {message.message}
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
}));
