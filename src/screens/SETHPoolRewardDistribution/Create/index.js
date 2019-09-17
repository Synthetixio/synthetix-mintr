import React, { useContext } from 'react';
import { ethers } from 'ethers';

import snxJSConnector from '../../../helpers/snxJSConnector';
import { Store } from '../../../store';

import { SliderContext } from '../../../components/Slider';
import Action from './Action';

import { getMultisig, getAirdropper } from '../hooks';

import addresses from '../contracts/addresses.json';

const MainContainer = ({ cancel }) => {
  const { handleNext } = useContext(SliderContext);
  const props = useContext(SliderContext);
  
  const {
    state: { wallet },
  } = useContext(Store);
  console.log(wallet);

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
      const transaction = await multisig.submitTransaction(addresses.airdropper, 0, transactionData);
      if (transaction) {
        handleNext(2);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return [Action].map((SlideContent, i) => (
    <SlideContent key={i} onCreate={onCreate} cancel={cancel} {...props} />
  ));
};

export default MainContainer;
