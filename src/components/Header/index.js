import React from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import * as candidateActions from '../../actions/CandidateActions';
import {connect} from 'react-redux';
import { Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle } from 'material-ui/Toolbar';
import CircularProgress from 'material-ui/CircularProgress';
import { EtherIcon, AdtIcon } from './Icons';
import keys from '../../i18n';
import './style.css';
import IconButton from 'material-ui/IconButton';
import RegistryIcon from 'material-ui/svg-icons/av/playlist-add';
import GlobalIcon from 'material-ui/svg-icons/av/new-releases';
import { yellow500 } from 'material-ui/styles/colors';
import storage from '../../utils/CookieStorage';

const tcrOfTcrs = require('../../cfg.json').TCRofTCRs;

const Header = ({ balance, onSwitcherClick, onSettingsClick, onTCRofTCRsClick, isTCRofTCRsActive }) => {
  const useBackend = !!storage.get('useBackend');
  return (
    <Toolbar className='Header'>
      <ToolbarGroup firstChild>
        <ToolbarTitle text={keys.registryName} className='HeaderTitle' />
      </ToolbarGroup>
      <ToolbarGroup>
        <EtherIcon style={{color: keys.headerTextColor, marginRight: 7}} />
        { balance.isFetchingBalance
          ? <CircularProgress color={keys.headerTextColor} size={25} />
          : <ToolbarTitle className='HeaderText' text={balance.ethers + ` ${keys.eth}`} />
        }
        <ToolbarSeparator className='Separator' />
        <AdtIcon style={{color: keys.headerTextColor, marginRight: 7}} />
        { balance.isFetchingBalance
          ? <CircularProgress color={keys.headerTextColor} size={25} />
          : <ToolbarTitle className='HeaderText' text={balance.tokens + ` ${keys.tokenName}`} />
        }
        <ToolbarSeparator className='Separator' />
        {!useBackend &&
        <IconButton tooltip='Switch to TCR of TCRs' onClick={onTCRofTCRsClick}>
          <GlobalIcon color={isTCRofTCRsActive ? yellow500 : keys.headerTextColor} />
        </IconButton>
        }
        <ToolbarSeparator className='Separator' />
        <IconButton tooltip='Switch registry' onClick={onSwitcherClick}>
          <RegistryIcon color={keys.headerTextColor} />
        </IconButton>
      </ToolbarGroup>
    </Toolbar>
  );
};

Header.propTypes = {
  // Sometimes web3 returns numbers as strings because they're greater than 2^53
  balance: PropTypes.object.isRequired,
  isTCRofTCRsActive: PropTypes.bool.isRequired,
  onTCRofTCRsClick: PropTypes.func.isRequired,
  onSwitcherClick: PropTypes.func.isRequired,
  onSettingsClick: PropTypes.func.isRequired
};

function mapStateToProps (state) {
  return {
    balance: state.candidate,
    isTCRofTCRsActive: state.app.registry === tcrOfTcrs.registry
  };
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(candidateActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
