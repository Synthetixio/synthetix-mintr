import React, { useContext, useState } from 'react';
import { ethers } from 'ethers';

import snxJSConnector from '../../../helpers/snxJSConnector';

import { SliderContext } from '../../../components/Slider';
import Action from './Action';
import Confirmation from './Confirmation';
import Complete from './Complete';

import { getMultisig, getAirdropper } from '../hooks';

import addresses from '../contracts/addresses.json';

const MainContainer = ({ goHome }) => {
  const { handleNext } = useContext(SliderContext);
  const [transaction, setTransaction] = useState(null);

  const onCreate = async recipientsData => {
    try {
      handleNext(1);
      let multisig = getMultisig();
      const airdropper = getAirdropper();
      multisig = multisig.connect(snxJSConnector.signer);

      const recipientsAddresses = [];
      const recipientsShares = [];
      recipientsData.forEach(item => {
        recipientsAddresses.push(item[0]);
        recipientsShares.push(ethers.utils.parseEther(Number(item[1]).toFixed(6)).toString());
      });
      
      const transactionData = airdropper.functions.multisend.encode([addresses.token, recipientsAddresses, recipientsShares]);
      const tx = await multisig.submitTransaction(addresses.airdropper, 0, transactionData);
      if (tx) {
        setTransaction(tx);
        handleNext(2);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const props = {
    onCreate,
    goHome,
    transaction,
  }

  return [Action, Confirmation, Complete].map((SlideContent, i) => (
    <SlideContent key={i} {...props} />
  ));
};

export default MainContainer;
