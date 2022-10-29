import React from 'react'
import { Types } from '@nixjs23n6/types'
import classNames from 'classnames'

export interface TelegramUser {
    id: number
    first_name: string
    last_name: string
    username: string
    photo_url: string
    auth_date: number
    hash: string
}

declare global {
    interface Window {
        TelegramLoginWidgetCb: any
    }
}

export interface TelegramButtonPropArg {
    botName: string
    widgetVersion?: string
    usePic?: boolean
    className?: string
    cornerRadius?: number
    requestAccess?: boolean
    lang?: string
    dataOnAuth: (user: TelegramUser) => void
    dataAuthUrl?: string
    buttonSize?: 'large' | 'medium' | 'small'
    children?: React.ReactNode
}

export const TelegramButton: React.FC<TelegramButtonPropArg> = ({
    botName,
    widgetVersion = 19,
    dataOnAuth,
    dataAuthUrl,
    buttonSize = 'large',
    className,
    cornerRadius,
    requestAccess = true,
    lang = 'en',
    usePic = false,
    children
}) => {
    const telegramRef = React.useRef<Types.Nullable<HTMLButtonElement>>(null)

    React.useEffect(() => {
        if (!!dataAuthUrl === !!dataOnAuth) {
            throw new Error('One of this props should be defined: dataAuthUrl (Redirect URL), dataOnAuth (callback fn) should be defined.')
        }

        if (dataOnAuth) {
            // eslint-disable-next-line @typescript-eslint/no-extra-semi
            window.TelegramLoginWidgetCb = dataOnAuth
        }

        const script = document.createElement('script')
        script.src = `https://telegram.org/js/telegram-widget.js?${widgetVersion}`
        script.async = true

        const attributes = {
            'data-telegram-login': botName,
            'data-size': buttonSize,
            'data-radius': cornerRadius,
            'data-request-access': requestAccess ? 'write' : undefined,
            'data-userpic': usePic,
            'data-lang': lang,
            'data-auth-url': dataAuthUrl,
            'data-onauth': 'TelegramLoginWidgetCb(user)'
        }

        for (const [k, v] of Object.entries(attributes)) {
            v !== undefined && script.setAttribute(k, `${v}`)
        }

        telegramRef.current!.appendChild(script)

        return () => {
            if (telegramRef.current) {
                telegramRef.current.innerHTML = ''
            }
            if (window.TelegramLoginWidgetCb) {
                delete window.TelegramLoginWidgetCb
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
            <button ref={telegramRef} className={classNames('position-relative overflow-hidden', className)}>
                {children}
            </button>
        </>
    )
}
