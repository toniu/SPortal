/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-floating-promises */
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { Web } from '@pnp/sp/webs';
import { spfi, SPFI, SPFx } from "@pnp/sp/presets/all";


export default class spservices {
    private _sp: SPFI = null;

    constructor(private context: WebPartContext) {
        this._sp = spfi()
        this._sp.using(SPFx(this.context));
    }

    public async getInfo(site: string): Promise<any[]> {
        try {
           const siteWeb = new (Web as any)(site);
            const Items: any = await siteWeb.lists.getByTitle("Site%20Pages").items
                .select("id,Title,Description,BannerImageUrl,Created,Author/ID,Author/FirstName,Author/LastName,Author/Title,FileRef")
                .filter('PromotedState eq 2')
                .expand("Author/ID")
                .get();


            const Res: any[] | PromiseLike<any[]> = [];
            Items.map((item: { FileRef: any; Created: string; Author: { Title: any; }; Title: any; Description: any; Id: any; BannerImageUrl: { Url: any; }; }) => {
                const Url = site.split('/sites/')[0] + item.FileRef;
                const Date = item.Created.split('T')[0];
                Res.push({
                    Author: item.Author.Title,
                    Title: item.Title,
                    Description: item.Description,
                    Id: item.Id,
                    Created: Date,
                    BannerImageUrl: item.BannerImageUrl.Url,
                    Url: Url
                });
            });
            return Res;
        }
        catch (error) {
            return Promise.reject(error);
        }
    }

    public async getComments(Site: any, ID: any): Promise<any> {
        try {
            const siteWeb = new (Web as any) (Site);
            const Comments: any = await siteWeb.lists.getByTitle("Site%20Pages").items.getById(ID).comments.get();
            let AmmountofComments = Comments.length;
            Comments.map((item: { replyCount: any; }) => {
                AmmountofComments += item.replyCount;
            });
            return AmmountofComments;
        }
        catch (error) {
            return Promise.reject(error);
        }
    }

    public async getLikes(Site: any, ID: any): Promise<any> {
        try {
            const siteWeb = new (Web as any) (Site);
            const Likes: any = await siteWeb.lists.getByTitle("Site%20Pages").items.getById(ID).getLikedByInformation();
            return Likes.likeCount;
        }

        catch (error) {
            return Promise.reject(error);
        }
    }
}