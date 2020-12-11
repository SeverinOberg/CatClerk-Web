class Helpers {

    getCookie(name: string) {
        const value = `; ${document.cookie}`;
        let parts = [""]
        if (value != undefined) { 
            parts = value.split(`; ${name}=`);
        }
        
        if (parts.length === 2) {
            return parts.pop()!.split(';').shift();
        }
    }
}
      
export default new Helpers();