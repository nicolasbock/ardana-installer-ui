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
import { translate } from '../localization/localize.js';
import { ActionButton } from '../components/Buttons.js';
import { ServerInputLine, ServerDropdown} from '../components/ServerUtils.js';
import { IpV4AddressValidator, MacAddressValidator } from '../utils/InputValidators.js';
import { INPUT_STATUS } from '../utils/constants.js';
import { EditCloudSettings } from '../pages/ServerRoleSummary/EditCloudSettings.js';
import { getNicMappings, getServerGroups } from '../utils/ModelUtils.js';

class EditServerDetails extends Component {
  constructor(props) {
    super(props);

    this.allInputsStatus = {
      'ip-addr': INPUT_STATUS.UNKNOWN,
      'ilo-user': INPUT_STATUS.UNKNOWN,
      'ilo-password': INPUT_STATUS.UNKNOWN,
      'ilo-ip': INPUT_STATUS.UNKNOWN,
      'mac-addr': INPUT_STATUS.UNKNOWN
    };

    this.data = this.makeDeepCopy(this.props.data);
    this.state = {
      isFormValid: false,
      showAddServerGroup: false,
      showAddNicMapping: false,
      nicMappings: getNicMappings(this.props.model),
      serverGroups: getServerGroups(this.props.model)
    };
  }

  makeDeepCopy(srcData) {
    return JSON.parse(JSON.stringify(srcData));
  }

  isFormTextInputValid() {
    let isAllValid = true;
    let values = Object.values(this.allInputsStatus);
    isAllValid =
      (values.every((val) => {return val === INPUT_STATUS.VALID || val === INPUT_STATUS.UNKNOWN;}));

    return isAllValid;
  }

  isFormDropdownValid() {
    let isValid = true;
    if(this.data['server-group'] === '' ||
    this.data['server-group'] === undefined ||
    this.data['server-group'] === 'noopt') {
      isValid = false;
    }

    if(isValid) {
      if(this.data['nic-mapping'] === '' ||
      this.data['nic-mapping'] === undefined ||
      this.data['nic-mapping'] === 'noopt') {
        isValid = false;
      }
    }
    return isValid;
  }

  updateFormValidity = (props, isValid) => {
    this.allInputsStatus[props.inputName] = isValid ? INPUT_STATUS.VALID : INPUT_STATUS.INVALID;
    this.setState({isFormValid: this.isFormTextInputValid() && this.isFormDropdownValid()});
  }

  handleDone = () => {
    this.props.doneAction(this.data);
  }

  handleCancel = () => {
    this.props.cancelAction();
  }

  handleSelectGroup = (groupName) => {
    this.data['server-group'] = groupName;
    this.setState({isFormValid: this.isFormTextInputValid() && this.isFormDropdownValid()});
  }

  handleSelectNicMapping = (nicMapName) => {
    this.data['nic-mapping'] = nicMapName;
    this.setState({isFormValid: this.isFormTextInputValid() && this.isFormDropdownValid()});
  }

  handleInputChange = (e, isValid, props) => {
    let value = e.target.value;
    this.updateFormValidity(props, isValid);
    if (isValid) {
      this.data[props.inputName] = value;
    }
  }

  renderInput(name, type, isRequired, title, validate) {
    return (
      <ServerInputLine
        isRequired={isRequired} inputName={name} inputType={type} label={title}
        inputValidate={validate} inputValue={this.data[name]} moreClass={'has-button'}
        inputAction={this.handleInputChange} updateFormValidity={this.updateFormValidity}/>
    );
  }

  addServerGroup = () => {
    this.setState({showAddServerGroup: true});
  }

  addNicMapping = () => {
    this.setState({showAddNicMapping: true});
  }

  closeAddServerGroup = () => {
    this.setState({showAddServerGroup: false, serverGroups: getServerGroups(this.props.model)});
  }

  closeAddNicMapping = () => {
    this.setState({showAddNicMapping: false, nicMappings: getNicMappings(this.props.model)});
  }

  renderAddServerGroup() {
    return (
      <EditCloudSettings show={this.state.showAddServerGroup} model={this.props.model}
        oneTab='server-group' onHide={this.closeAddServerGroup}
        updateGlobalState={this.props.updateGlobalState}/>
    );
  }

  renderAddNicMapping() {
    return (
      <EditCloudSettings show={this.state.showAddNicMapping} model={this.props.model}
        oneTab='nic-mapping' onHide={this.closeAddNicMapping}
        updateGlobalState={this.props.updateGlobalState}/>
    );
  }

  renderDropDown(name, list, handler, isRequired, title, buttonLabel, addAction) {
    let emptyOptProps = '';
    if(this.data[name] === '' || this.data[name] === undefined) {
      emptyOptProps = {
        label: translate('server.please.select'),
        value: 'noopt'
      };
    }
    return (
      <div className='detail-line'>
        <div className='detail-heading'>{translate(title) + '*'}</div>
        <div className='input-body'>
          <div className='input-with-button'>
            <ServerDropdown name={this.props.name} value={this.data[name]} moreClass={'has-button'}
              optionList={list} emptyOption={emptyOptProps} selectAction={handler}/>
            <ActionButton type={'default'} clickAction={addAction} moreClass={'inline-button'}
              displayLabel={translate(buttonLabel) + ' ...'}/>
          </div>
        </div>
      </div>
    );
  }

  renderTextLine(title, value) {
    return (
      <div className='detail-line'>
        <div className='detail-heading'>{translate(title)}</div>
        <div className='info-body'>{value}</div>
      </div>
    );
  }

  renderServerContent() {
    return (
      <div>
        <div className='server-details-container'>
          {this.renderTextLine('server.id.prompt', this.data.id)}
          {this.renderTextLine('server.name.prompt', this.data.name)}
          {this.renderTextLine('server.role.prompt', this.data.role)}
          {this.renderInput('ip-addr', 'text', true, 'server.ip.prompt', IpV4AddressValidator)}
          {this.renderDropDown('server-group', this.state.serverGroups, this.handleSelectGroup, true,
            'server.group.prompt', 'server.group.prompt', this.addServerGroup)}
          {this.renderDropDown('nic-mapping', this.state.nicMappings, this.handleSelectNicMapping, true,
            'server.nicmapping.prompt', 'server.nicmapping.prompt', this.addNicMapping)}
        </div>
        <div className='message-line'>{translate('server.ipmi.message')}</div>
        <div className='server-details-container'>
          {this.renderInput('mac-addr', 'text', false, 'server.mac.prompt', MacAddressValidator)}
          {this.renderInput('ilo-ip', 'text', false, 'server.ipmi.ip.prompt',IpV4AddressValidator)}
          {this.renderInput('ilo-user', 'text', false, 'server.ipmi.username.prompt')}
          {this.renderInput('ilo-password', 'password', false, 'server.ipmi.password.prompt')}
        </div>
      </div>
    );
  }

  renderFooter() {
    return (
      <div className='btn-row input-button-container'>
        <ActionButton type='default'
          clickAction={this.handleCancel} displayLabel={translate('cancel')}/>
        <ActionButton
          isDisabled={!this.state.isFormValid}
          clickAction={this.handleDone} displayLabel={translate('done')}/>
      </div>
    );
  }

  render() {
    return (
      <div className='edit-server-details'>
        {this.renderServerContent()}
        {this.renderFooter()}
        {this.renderAddServerGroup()}
        {this.renderAddNicMapping()}
      </div>
    );
  }
}

export default EditServerDetails;
