import { HubConnectionBuilder } from "@microsoft/signalr";
import addNotification from "react-push-notification";

const hubUrl = ""

const connection = new HubConnectionBuilder()
    .withUrl(hubUrl)
    .build()

connection.on('ReceiveMessage', (user, message) => {
    addNotification({
        title: 'Notification',
        message: message,
        theme: 'darkblue',
        native: true
    })
})