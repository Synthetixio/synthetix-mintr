import React, { useEffect, useState, useRef } from 'react';
import ButtonPrimary from './ButtonPrimary';
import { withTranslation } from 'react-i18next';

const INTERVAL_COUNT = 1000;

function str_pad_left(string, pad, length) {
	return (new Array(length + 1).join(pad) + string).slice(-length);
}

const convertToTime = time => {
	const a = time / 1000;
	const minutes = Math.floor(a / 60);
	var seconds = a - minutes * 60;
	return str_pad_left(minutes, '0', 2) + ':' + str_pad_left(seconds, '0', 2);
};

const CountdownButton = ({
	waitingPeriod,
	defaultLabel,
	countdownLabel,
	disabled,
	onClick,
	margin,
	t,
}) => {
	const [timeLeft, setTimeLeft] = useState(0);
	const [countdownHasStarted, setCoundownHasStarted] = useState(false);
	const [intervalId, setIntervalId] = useState(null);
	const timeLeftRef = useRef(timeLeft);
	timeLeftRef.current = timeLeft;

	useEffect(() => {
		if (waitingPeriod && !timeLeft) {
			setTimeLeft(waitingPeriod);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [waitingPeriod]);

	useEffect(() => {
		if (!countdownHasStarted && timeLeft) {
			setCoundownHasStarted(true);
			const interval = setInterval(() => {
				const nextPeriod =
					timeLeftRef.current - INTERVAL_COUNT <= 0 ? 0 : timeLeftRef.current - INTERVAL_COUNT;
				setTimeLeft(nextPeriod);
			}, INTERVAL_COUNT);
			setIntervalId(interval);
		}
		return () => {
			if (timeLeftRef.current === 0) {
				clearTimeout(intervalId);
			}
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [timeLeftRef.current]);

	return (
		<ButtonPrimary
			waitingPeriod={waitingPeriod}
			disabled={disabled || timeLeft}
			onClick={onClick}
			margin={margin}
		>
			{timeLeft ? `${t(countdownLabel)} ${convertToTime(timeLeft)}` : t(defaultLabel)}
		</ButtonPrimary>
	);
};

export default withTranslation()(CountdownButton);
