import React, { createContext, useState, useEffect, useContext } from 'react';
import Notify from 'bnc-notify';

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
				dappId: '4e6901c8-10da-420c-9b5e-316fad480172',
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