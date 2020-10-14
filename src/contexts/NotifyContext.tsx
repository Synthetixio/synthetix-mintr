import React, { createContext, useState, useEffect, useContext } from 'react';
import Notify from 'bnc-notify';
import { BLOCKNATIVE_KEY } from 'helpers/networkHelper';

interface INotifyProvider {
	children: any;
	networkId: number;
}

export const NotifyContext = createContext({
	notify: null,
});

export const NotifyProvider: React.FC<INotifyProvider> = ({ children, networkId }) => {
	const [notify, setNotify] = useState<any>(null);

	useEffect(() => {
		setNotify(
			Notify({
				dappId: BLOCKNATIVE_KEY,
				networkId: networkId,
				darkMode: true,
			})
		);
	}, [networkId]);
	return (
		<NotifyContext.Provider
			value={{
				notify,
			}}
		>
			{children}
		</NotifyContext.Provider>
	);
};

export const useNotifyContext = () => useContext(NotifyContext);
