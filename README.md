# @nixjs23n6/telegram-login

A Component React for Telegram Login

## Quick Setup

### Install

Install these dependencies:

`yarn add @nixjs23n6/telegram-login`

### Setup & Usage

```typescript
import { TelegramButton, TelegramUser } from '@nixjs23n6/telegram-login'

interface LoginPropArg {}

export const Login: React.FC<LoginPropArg> = () => {
    const responseTelegram = (response: TelegramUser) => console.log(response)

    return (<TelegramButton dataOnAuth={responseTelegram} botName={__TELEGRAM_BOT__}/>)
}
```
