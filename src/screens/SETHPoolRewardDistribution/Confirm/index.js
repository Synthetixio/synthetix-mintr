import React, { useContext, useState } from 'react';
// import { ethers } from 'ethers';

import snxJSConnector from '../../../helpers/snxJSConnector';

import { SliderContext } from '../../../components/Slider';
import Action from './Action';
import Confirmation from '../Confirmation';
import Complete from '../Complete';

import { getMultisig } from '../hooks';

import addresses from '../contracts/addresses.json';

const MainContainer = ({ goHome, multisendTx }) => {
  const { handleNext } = useContext(SliderContext);
  const [transaction, setTransaction] = useState(null); // eslint-disable-line
  
  const onConfirm = async () => {
    try {
      handleNext(1);
      let multisig = getMultisig();
      multisig = multisig.connect(snxJSConnector.signer);

      const airdropperTx = {
        from: addresses.multisig,
        to: addresses.airdropper,
        data: multisendTx.data,
        value: 0,
      };
      const airdropperGas = await snxJSConnector.provider.estimateGas(airdropperTx);
      const multisigGas = await multisig.estimate.confirmTransaction(multisendTx.id);
      const gasLimit = airdropperGas.add(multisigGas).toNumber() * 1.2;
      const tx = await multisig.confirmTransaction(multisendTx.id, { gasLimit });
      if (tx) {
        setTransaction(tx);
        handleNext(2);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const props = {
    onConfirm,
    goHome,
    transaction,
    multisendTx,
  }

  return [Action, Confirmation, Complete].map((SlideContent, i) => (
    <SlideContent key={i} {...props} />
  ));
};

export default MainContainer;
