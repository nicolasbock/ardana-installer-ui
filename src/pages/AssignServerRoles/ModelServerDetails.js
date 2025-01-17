// (c) Copyright 2017-2018 SUSE LLC
/**
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
**/
import React, { Component } from 'react';
import { translate } from '../../localization/localize.js';

class ModelServerDetails extends Component {
  constructor(props) {
    super(props);
  }

  renderTextLine(title, value) {
    return (
      <div className='detail-line'>
        <div className='detail-heading bold'>{translate(title) + ':'}</div>
        <div className='info-body readonly'>{value || ''}</div>
      </div>
    );
  }

  maskPassword(pass) {
    if(!pass || pass.length === 0) {
      return '';
    }

    return '*'.repeat(pass.length);
  }

  renderDetailsContent = () => {
    if(this.props.data) {
      return (
        <div className='server-details-container viewonly'>
          {this.renderTextLine('server.id.prompt', this.props.data.id)}
          {this.renderTextLine('server.name.prompt', this.props.data.name)}
          {this.renderTextLine('server.role.prompt', this.props.data.role)}
          {this.renderTextLine('server.ip.prompt', this.props.data['ip-addr'])}
          {this.renderTextLine('server.group.prompt', this.props.data['server-group'])}
          {this.renderTextLine('server.nicmapping.prompt', this.props.data['nic-mapping'])}
          {this.renderTextLine('server.mac.prompt', this.props.data['mac-addr'])}
          {this.renderTextLine('server.ipmi.ip.prompt', this.props.data['ilo-ip'])}
          {this.renderTextLine('server.ipmi.username.prompt', this.props.data['ilo-user'])}
          {this.renderTextLine('server.ipmi.password.prompt', this.maskPassword(this.props.data['ilo-password']))}
        </div>
      );
    }
  }

  render() {
    return (<div>{this.renderDetailsContent()}</div>);
  }
}

export default ModelServerDetails;
