import React, { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';
import { View, ScreenSpinner, AdaptivityProvider, AppRoot, ConfigProvider, SplitLayout, SplitCol } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

import Home from './panels/Home';
import Persik from './panels/Persik';

import verifyLaunchParams from './signUser.js';
// import bridge from '@vkontakte/vk-bridge';
const secretKeyOfYourApp = 'W11Q4F7GS2721s7cJWEi'

async function startCheck() {
	// Таким образом мы можем получить URL, который нам нужен для верификации пользователя :)
	const URL = globalThis.location.href;
	console.log(URL, 'here');
	// Имиортируем ту самую функцию 'verifyLaunchParams' из файла 'signUser.js'. 
	// Передаем мы URL с параметрами и секретный ключ нашего приложения, который находится в настройках самого же приложения. 
	console.log(verifyLaunchParams(URL, secretKeyOfYourApp) ? 'Успешно подтверждено :)' : 'Не подтверждено :(');
	const user = await bridge.send('VKWebAppGetUserInfo'); // Обращаемся к bridge и отправляем событие "VKWebAppGetUserInfo".
	console.log('Проверка связи')
	// В ответ мы получаем объект с данными о пользователе
	const userId = user.id; // Тут я достаю ID пользователя
	const first_name = user?.first_name; // Тут я достаю имя пользователя
	const last_name = user?.last_name; // Тут я достаю фамилию пользователя
	const country = user?.country?.title; // Тут я достаю страну пользователя
	const city = user?.city?.title; // Тут я достаю город пользователя
	const photos = []; // Сюда буду складывать URLs фотографий
	for (key in user) key.includes('photo') && photos.push(user[key]); // Если есть ключ, который содержит 'photo', я добавляю его в масиив 'photos'
	// Также вам нужно учти тот факт, если каких-то данных о пользователе не будет, тогда переменная примет 'undefined'. Вы можете делать проверку
	//если это нужно.
	
}

const App = () => {
	const [scheme, setScheme] = useState('bright_light')
	const [activePanel, setActivePanel] = useState('home');
	const [fetchedUser, setUser] = useState(null);
	const [popout, setPopout] = useState(<ScreenSpinner size='large' />);
	// Запускаем проверку
	startCheck()
	useEffect(() => {
		bridge.subscribe(({ detail: { type, data }}) => {
			if (type === 'VKWebAppUpdateConfig') {
				setScheme(data.scheme)
				console.log(globalThis.URL)
			}
		});

		async function fetchData() {
			const user = await bridge.send('VKWebAppGetUserInfo');
			startCheck()
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
