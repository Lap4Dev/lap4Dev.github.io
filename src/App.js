import React, { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';
import { View, ScreenSpinner, AdaptivityProvider, AppRoot, ConfigProvider, SplitLayout, SplitCol } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

import Home from './panels/Home';
import Persik from './panels/Persik';

const qs = require('querystring');
const crypto = require('crypto');

const App = () => {
	const [scheme, setScheme] = useState('bright_light')
	const [activePanel, setActivePanel] = useState('home');
	const [fetchedUser, setUser] = useState(null);
	const [popout, setPopout] = useState(<ScreenSpinner size='large' />);
	console.log("HELLO")
	console.log(globalThis.location.href)
	

	const urlParams = qs.parse(URL_PARAMS);
	const signKeys = new URLSearchParams(URL_PARAMS)
		.get('sign_keys')
		.split(',');

	const ordered = {};

	signKeys.forEach(key => ordered[key] = urlParams[key]);

	const stringParams = qs.stringify(ordered);
	const paramsHash = crypto
		.createHmac('sha256', secretKey)
		.update(stringParams)
		.digest()
		.toString('base64')
		.replace(/\+/g, '-')
		.replace(/\//g, '_')
		.replace(/=$/, '');

	console.log(paramsHash === urlParams.sign);
	useEffect(() => {
		bridge.subscribe(({ detail: { type, data }}) => {
			if (type === 'VKWebAppUpdateConfig') {
				setScheme(data.scheme)
				console.log(globalThis.URL)
			}
		});

		async function fetchData() {
			const user = await bridge.send('VKWebAppGetUserInfo');
			console.log(user)
			setUser(user);
			setPopout(null);
		}
		fetchData();
	}, []);

	const go = e => {
		setActivePanel(e.currentTarget.dataset.to);
	};

	return (
		<ConfigProvider scheme={scheme}>
			<AdaptivityProvider>
				<AppRoot>
					<SplitLayout popout={popout}>
						<SplitCol>
							<View activePanel={activePanel}>
								<Home id='home' fetchedUser={fetchedUser} go={go} />
								<Persik id='persik' go={go} />
							</View>
						</SplitCol>
					</SplitLayout>
				</AppRoot>
			</AdaptivityProvider>
		</ConfigProvider>
	);
}

export default App;
