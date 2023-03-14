/* SP/PNP imports */
import "pnp/sp/webs"
import "pnp/sp/lists"
import "pnp/sp/fields"
import "@pnp/sp/site-users/web"
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { SPFI } from '@pnp/sp';
import { getSP } from '../pnpjsConfig';

export class UserEventService {
    private _sp: SPFI;

    public setup(context: WebPartContext): void {
        this._sp = getSP(context);
        console.log(this._sp)
    }
}

const EventService = new UserEventService();
export default EventService;