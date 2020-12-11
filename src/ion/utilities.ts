import { alertController, toastController } from "@ionic/vue"
import { Plugins } from "@capacitor/core";


export default class Utilities {

  // IonAlert create
  public ionAlert = async function ionAlert(header: string, message: string, buttons: Array<any>) {
    return await alertController
      .create({
        header: header,
        message: message,
        buttons: buttons,
      })
      .then(alert => alert.present());
  }

  // ionToast create
  public ionToast = async function ionToast(message: string) {
    return await toastController
      .create({
        message: message,
        duration: 2000,
        cssClass: "secondary",
      })
      .then(alert => alert.present());
  }

  public localNotification = async function localNotification(title: string, body: string, id: number, schedule: Date) {
    const { LocalNotifications } = Plugins;

    const canSend = await LocalNotifications.requestPermission();

    if (canSend) {
      return await LocalNotifications.schedule({
        notifications: [
          {
            title: title,
            body: body,
            id: id,
            schedule: { at: new Date(schedule) },
          }
        ]
    }).then(n => console.log(n));
    }
}
}


