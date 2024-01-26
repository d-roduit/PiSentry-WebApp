'use client';

import { useEffect, useRef, useState } from 'react';
import Switch from '@/components/Switch/Switch.jsx';
import FetchRequest from '@/helpers/FetchRequest.js';
import LoadingSpinner from '@/components/Loading/Spinner.jsx';
import { FaCircleExclamation, FaCircleInfo } from 'react-icons/fa6';
import Modal from '@/components/Modal/Modal.jsx';
import urls from '@/urls.js';

const { notificationsApiEndpoint } = urls;

const modalNames = {
    serviceWorkerNotSupported: 'serviceWorkerNotSupported',
    pushApiNotSupported: 'pushApiNotSupported',
    noServiceWorkerRegistered: 'noServiceWorkerRegistered',
    notificationsApiNotSupported: 'notificationsApiNotSupported',
    pushNotificationsPermissionDenied: 'pushNotificationsPermissionDenied',
};

export default function NotificationsSwitchSetting({ cameraId }) {
    const [on, setOn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [dataState, setDataState] = useState(null);
    const [modalNameToShow, setModalNameToShow] = useState(null);

    const isSwitchEnabled = useRef(false);

    useEffect(() => {
        const initializeSwitch = async () => {
            const pushSubscription = await getPushSubscription();

            if (pushSubscription === null) {
                isSwitchEnabled.current = true;
                setIsLoading(false);
                return;
            }

            await new FetchRequest(`${notificationsApiEndpoint}/${cameraId}?endpoint=${pushSubscription.endpoint}`)
                .options({
                    method: 'GET',
                    headers: { Authorization: 'mytoken' },
                    next: { revalidate: 0 },
                })
                .responseType(FetchRequest.ResponseType.Json)
                .success((subscriptions) => {
                    isSwitchEnabled.current = true;

                    if (subscriptions.length > 0) {
                        setOn(true);
                    }
                })
                .responseNotOk((response) => {
                    switch (response.status) {
                        case 400:
                            setDataState({
                                icon: <FaCircleExclamation className="shrink-0"/>,
                                textColor: 'text-gray-500',
                                message: 'Failed to recover notifications state due to data error.',
                            });
                            break;
                        case 500:
                            setDataState({
                                icon: <FaCircleExclamation className="shrink-0"/>,
                                textColor: 'text-gray-500',
                                message: 'Failed to recover notifications state due to server error.',
                            });
                            break;
                    }
                })
                .exception(() => {
                    setDataState({
                        icon: <FaCircleExclamation className="shrink-0"/>,
                        textColor: 'text-gray-500',
                        message: 'An error occured while recovering notifications state.',
                    });
                })
                .make()

            setIsLoading(false);
        };

        if (!isServiceWorkerSupported() || !isPushApiSupported()) {
            const modalNameToShow = !isServiceWorkerSupported()
                ? modalNames.serviceWorkerNotSupported
                : modalNames.pushApiNotSupported;

            setDataState({
                icon: <FaCircleExclamation className="shrink-0"/>,
                textColor: 'text-amber-500',
                message: (
                    <>
                        Notifications are not supported in this browser.
                        <span
                            className="ml-2 underline cursor-pointer"
                            onClick={() => setModalNameToShow(modalNameToShow)}
                        >
                            More info...
                        </span>
                    </>
                ),
            });
            setIsLoading(false);
            return;
        }

        initializeSwitch();
    }, [cameraId]);

    const renderServiceWorkerNotSupportedModal = () => (
        <Modal
            header={
                <p className="text-lg font-semibold leading-6 text-gray-900">
                    <FaCircleInfo className="inline mr-2 mb-0.5" />
                    Service Worker is not supported
                </p>
            }
            body={
                <div className="space-y-4">
                    <p className="text-base text-gray-600 leading-relaxed">
                        Service Worker is a required feature to be able to receive notifications in the browser.
                    </p>
                    <p className="text-base text-gray-600 leading-relaxed">
                        Your browser may not support it for various reasons:
                    </p>
                    <ul className="list-disc list-inside text-base text-gray-600 leading-relaxed">
                        <li>your browser is too old/not updated and does not support certain modern features</li>
                        <li>you are in private browsing mode</li>
                        <li>the website is not served over HTTPS</li>
                    </ul>
                    <p className="text-base text-gray-600 leading-relaxed">
                        For notifications to work optimally, make sure to have the latest version of your browser,
                        to browse in normal mode and to use the HTTPS version of the website.
                    </p>
                </div>
            }
            footer={
                <div className="flex sm:justify-end">
                    <button
                        className="w-full px-5 py-2.5 rounded-lg bg-indigo-600 text-white text-sm text-center font-medium shadow-sm hover:bg-indigo-700 sm:w-auto"
                        onClick={() => setModalNameToShow(null)}
                    >
                        Close
                    </button>
                </div>
            }
            closeButton={true}
            onClickOverlay={() => setModalNameToShow(null)}
            onClickCloseButton={() => setModalNameToShow(null)}
        />
    );

    const renderPushApiNotSupportedModal = () => (
        <Modal
            header={
                <p className="text-lg font-semibold leading-6 text-gray-900">
                    <FaCircleInfo className="inline mr-2 mb-0.5" />
                    Push API not supported
                </p>
            }
            body={
                <div className="space-y-4">
                    <p className="text-base text-gray-600 leading-relaxed">
                        The Push API is a required feature to be able to receive notifications in the browser.
                    </p>
                    <p className="text-base text-gray-600 leading-relaxed">
                        Your browser may not support it for various reasons:
                    </p>
                    <ul className="list-disc list-inside text-base text-gray-600 leading-relaxed">
                        <li>your browser is too old/not updated and does not support certain modern features</li>
                        <li>on iOS, the Push API is only available on web apps installed on the home screen</li>
                    </ul>
                    <p className="text-base text-gray-600 leading-relaxed">
                        For notifications to work optimally, make sure to have the latest version of your browser.
                    </p>
                </div>
            }
            footer={
                <div className="flex sm:justify-end">
                    <button
                        className="w-full px-5 py-2.5 rounded-lg bg-indigo-600 text-white text-sm text-center font-medium shadow-sm hover:bg-indigo-700 sm:w-auto"
                        onClick={() => setModalNameToShow(null)}
                    >
                        Close
                    </button>
                </div>
            }
            closeButton={true}
            onClickOverlay={() => setModalNameToShow(null)}
            onClickCloseButton={() => setModalNameToShow(null)}
        />
    );

    const renderNoServiceWorkerRegisteredModal = () => (
        <Modal
            header={
                <p className="text-lg font-semibold leading-6 text-gray-900">
                    <FaCircleExclamation className="inline mr-2 mb-0.5" />
                    No active service worker
                </p>
            }
            body={
                <div className="space-y-4">
                    <p className="text-base text-gray-600 leading-relaxed">
                        An active service worker is required to manage notifications in the browser.
                    </p>
                    <p className="text-base text-gray-600 leading-relaxed">
                        Try refreshing the page for the service worker to register and activate.
                    </p>
                </div>
            }
            footer={
                <div className="flex sm:justify-end">
                    <button
                        className="w-full px-5 py-2.5 rounded-lg bg-indigo-600 text-white text-sm text-center font-medium shadow-sm hover:bg-indigo-700 sm:w-auto"
                        onClick={() => setModalNameToShow(null)}
                    >
                        Close
                    </button>
                </div>
            }
            closeButton={true}
            onClickOverlay={() => setModalNameToShow(null)}
            onClickCloseButton={() => setModalNameToShow(null)}
        />
    );

    const renderNotificationsApiNotSupportedModal = () => (
        <Modal
            header={
                <p className="text-lg font-semibold leading-6 text-gray-900">
                    <FaCircleInfo className="inline mr-2 mb-0.5" />
                    Notifications API not supported
                </p>
            }
            body={
                <div className="space-y-4">
                    <p className="text-base text-gray-600 leading-relaxed">
                        The Notifications API is a required feature to be able to display notifications in the browser.
                    </p>
                    <p className="text-base text-gray-600 leading-relaxed">
                        Your browser may not support it for various reasons:
                    </p>
                    <ul className="list-disc list-inside text-base text-gray-600 leading-relaxed">
                        <li>your browser is too old/not updated and does not support certain modern features</li>
                        <li>the website is not served over HTTPS</li>
                    </ul>
                    <p className="text-base text-gray-600 leading-relaxed">
                        For notifications to work optimally, make sure to have the latest version of your browser
                        and to use the HTTPS version of the website.
                    </p>
                </div>
            }
            footer={
                <div className="flex sm:justify-end">
                    <button
                        className="w-full px-5 py-2.5 rounded-lg bg-indigo-600 text-white text-sm text-center font-medium shadow-sm hover:bg-indigo-700 sm:w-auto"
                        onClick={() => setModalNameToShow(null)}
                    >
                        Close
                    </button>
                </div>
            }
            closeButton={true}
            onClickOverlay={() => setModalNameToShow(null)}
            onClickCloseButton={() => setModalNameToShow(null)}
        />
    );

    const renderPushNotificationsPermissionDeniedModal = () => (
        <Modal
            header={
                <p className="text-lg font-semibold leading-6 text-gray-900">
                    <FaCircleInfo className="inline mr-2 mb-0.5" />
                    Push notifications permission denied
                </p>
            }
            body={
                <div className="space-y-4">
                    <p className="text-base text-gray-600 leading-relaxed">
                        Permission for push notifications for this website is denied in your browser.
                    </p>
                    <p className="text-base text-gray-600 leading-relaxed">To be able to enable notifications, you have to reset that browser setting first.</p>
                </div>
            }
            footer={
                <div className="flex sm:justify-end">
                    <button
                        className="w-full px-5 py-2.5 rounded-lg bg-indigo-600 text-white text-sm text-center font-medium shadow-sm hover:bg-indigo-700 sm:w-auto"
                        onClick={() => setModalNameToShow(null)}
                    >
                        Close
                    </button>
                </div>
            }
            closeButton={true}
            onClickOverlay={() => setModalNameToShow(null)}
            onClickCloseButton={() => setModalNameToShow(null)}
        />
    );

    const isServiceWorkerSupported = () => 'serviceWorker' in navigator;

    const isPushApiSupported = () => 'PushManager' in window;

    const isNotificationsApiSupported = () => 'Notification' in window;

    const isServiceWorkerRegistered = () => navigator.serviceWorker.controller !== null;

    const getCurrentPushNotificationsPermission = () => Notification.permission;

    const askPushNotificationsPermission = async () => await Notification.requestPermission() === 'granted';

    const subscribeUserToPushNotifications = async () => {
        const serviceWorkerRegistration = await navigator.serviceWorker.ready;

        return await serviceWorkerRegistration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: 'BDMJlhUeJ0cPUbzzGjZpKBhuPV7XoxaCW2RAFY7gIBrg65JIUCE3Ryxutn5NX1FdA5e1w28y45WTi38aqJZ4FSQ' // encoded in Base64
        });
    };

    const insertPushSubscriptionInDB = async (pushSubscription) => {
        const { exception, notOk, response } = await new FetchRequest(`${notificationsApiEndpoint}/${cameraId}/subscribe`)
            .options({
                method: 'POST',
                headers: {
                    Authorization: 'mytoken',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ subscription: pushSubscription }),
            })
            .make();

        setIsLoading(false);

        if (exception) {
            setDataState({
                icon: <FaCircleExclamation className="shrink-0"/>,
                textColor: 'text-red-500',
                message: 'An error occurred while enabling notifications. Please retry.',
            });
            return false;
        }

        if (notOk) {
            switch (response.status) {
                case 400:
                case 404:
                    setDataState({
                        icon: <FaCircleExclamation className="shrink-0"/>,
                        textColor: 'text-red-500',
                        message: 'Failed to enable notifications due to data error. Please retry.',
                    });
                    break;
                case 500:
                    setDataState({
                        icon: <FaCircleExclamation className="shrink-0"/>,
                        textColor: 'text-red-500',
                        message: 'Failed to enable notifications due to server error. Please retry.',
                    });
                    break;
            }
            return false;
        }

        return true;
    };

    const getPushSubscription = async () => {
        const serviceWorkerRegistration = await navigator.serviceWorker.ready;
        return await serviceWorkerRegistration.pushManager.getSubscription();
    };

    const removePushSubscriptionFromDB = async (pushSubscription) => {
        const { exception, notOk, response } = await new FetchRequest(`${notificationsApiEndpoint}/${cameraId}`)
            .options({
                method: 'DELETE',
                headers: {
                    Authorization: 'mytoken',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ subscription: pushSubscription }),
            })
            .make();

        setIsLoading(false);

        if (exception) {
            setDataState({
                icon: <FaCircleExclamation className="shrink-0"/>,
                textColor: 'text-red-500',
                message: 'An error occurred while disabling notifications. Please retry.',
            });
            return false;
        }

        if (notOk) {
            switch (response.status) {
                case 400:
                    setDataState({
                        icon: <FaCircleExclamation className="shrink-0"/>,
                        textColor: 'text-red-500',
                        message: 'Failed to disable notifications due to data error. Please retry.',
                    });
                    break;
                case 500:
                    setDataState({
                        icon: <FaCircleExclamation className="shrink-0"/>,
                        textColor: 'text-red-500',
                        message: 'Failed to disable notifications due to server error. Please retry.',
                    });
                    break;
            }
            return false;
        }

        return true;
    };

    const onClickSwitch = async (onAfterClick) => {
        if (!isSwitchEnabled.current) {
            return;
        }

        if (dataState !== null) {
            setIsLoading(true);
        }

        isSwitchEnabled.current = false;
        setDataState(null);

        if (!isServiceWorkerSupported()) {
            isSwitchEnabled.current = true;
            setModalNameToShow(modalNames.serviceWorkerNotSupported);
            return;
        }

        if (!isPushApiSupported()) {
            isSwitchEnabled.current = true;
            setModalNameToShow(modalNames.pushApiNotSupported);
            return;
        }

        if (onAfterClick) {
            if (!isServiceWorkerRegistered()) {
                isSwitchEnabled.current = true;
                setModalNameToShow(modalNames.noServiceWorkerRegistered);
                return;
            }

            if (!isNotificationsApiSupported()) {
                isSwitchEnabled.current = true;
                setModalNameToShow(modalNames.notificationsApiNotSupported);
                return;
            }

            const currentPushNotificationsPermission = getCurrentPushNotificationsPermission();

            if (currentPushNotificationsPermission === 'denied') {
                isSwitchEnabled.current = true;
                setModalNameToShow(modalNames.pushNotificationsPermissionDenied);
                setIsLoading(false);
                return;
            }

            if (!(await askPushNotificationsPermission())) {
                isSwitchEnabled.current = true;
                setDataState({
                    icon: <FaCircleExclamation className="shrink-0"/>,
                    textColor: 'text-gray-500',
                    message: (
                        <>
                            Notifications permission denied.
                            <span
                                className="ml-2 underline cursor-pointer"
                                onClick={() => setModalNameToShow(modalNames.pushNotificationsPermissionDenied)}
                            >
                            More info...
                        </span>
                        </>
                    ),
                });
                return;
            }

            const pushSubscription = await subscribeUserToPushNotifications();

            if (!(await insertPushSubscriptionInDB(pushSubscription))) {
                isSwitchEnabled.current = true;
                return;
            }

            isSwitchEnabled.current = true;
            setOn(true);
        } else {
            const pushSubscription = await getPushSubscription();

            // If pushSubscription is null here, it means that the subscription has been removed
            // via the browser settings, and not via our delete fetch request.
            // The subscription which could not be removed with the delete fetch request will be automatically removed
            // when we try to send a notification to the endpoint and it rejects with status 'expired'.
            if (pushSubscription === null) {
                isSwitchEnabled.current = true;
                setIsLoading(false);
                setOn(false);
                return;
            }

            if (!(await removePushSubscriptionFromDB(pushSubscription))) {
                isSwitchEnabled.current = true;
                return;
            }

            isSwitchEnabled.current = true;
            setOn(false);
        }
    };

    return (
        <>
            <div className="flex justify-between items-start">
                <div>
                    <p className="font-medium">Notifications</p>
                    <p className="text-sm text-gray-500 mt-1">Receive a notification when the camera detects an
                        object.</p>
                </div>
                <div className="flex items-center">
                    {isLoading && (
                        <LoadingSpinner className="mr-3 h-6 w-6 border-2 border-gray-500 border-r-transparent"/>
                    )}
                    <Switch
                        onClick={() => onClickSwitch(!on)}
                        on={on}
                        srOnly="Enable notifications"
                        disabled={!isSwitchEnabled.current}
                    />
                </div>
            </div>
            {dataState !== null && (
                <div className={`mt-2 flex items-center text-sm ${dataState.textColor}`}>
                    {dataState.icon}
                    <p className="ml-2">{dataState.message}</p>
                </div>
            )}
            {modalNameToShow === 'serviceWorkerNotSupported' && renderServiceWorkerNotSupportedModal()}
            {modalNameToShow === 'pushApiNotSupported' && renderPushApiNotSupportedModal()}
            {modalNameToShow === 'noServiceWorkerRegistered' && renderNoServiceWorkerRegisteredModal()}
            {modalNameToShow === 'notificationsApiNotSupported' && renderNotificationsApiNotSupportedModal()}
            {modalNameToShow === 'pushNotificationsPermissionDenied' && renderPushNotificationsPermissionDeniedModal()}
        </>
    );
};
