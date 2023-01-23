import * as React from 'react';
// import styles from './Faq.module.scss';
import { IFaqProps } from './IFaqProps';
// import { escape } from '@microsoft/sp-lodash-subset';
import { SPFI } from '@pnp/sp';
import { useEffect, useState } from 'react';
import { IFAQ } from '../../../interfaces';
import { getSP } from '../../../pnpjsConfig';
import { Accordion } from "@pnp/spfx-controls-react/lib/Accordion";
import { Placeholder } from "@pnp/spfx-controls-react/lib/Placeholder";
import { WebPartTitle } from "@pnp/spfx-controls-react/lib/WebPartTitle";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const Faq = (props:IFaqProps) =>{

  // const LOG_SOURCE = 'FAQ Webpart';
  // const LIST_NAME = 'FAQ';
  const _sp:SPFI = getSP(props.context);

  const [faqItems,setFaqItems] = useState<IFAQ[]>([])

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const getFAQItems = async () => {

    console.log('context',_sp)
    const items = _sp.web.lists.getById(props.listGuid).items.select().orderBy('Letter',true).orderBy('Title',true)();

    console.log('FAQ Items',items)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setFaqItems((await items).map((item:any) => {
      return {
        Id: item.Id,
        Title: item.Title,
        Body: item.Body,
        Letter: item.Letter
      }
    }));

  }

  useEffect(() => {

    console.log('props',props)

    if(props.listGuid && props.listGuid !== '') {
      // eslint-disable-next-line no-void
      void getFAQItems();
    }
  
  },[props])
  

  return (
    <>
    <div className="m-1 bg-red-100 text-xs">
      Hello TailwindCSS!
    </div>
    <WebPartTitle displayMode={props.displayMode}
              title={props.title}
              updateProperty={props.updateProperty} />
    {props.listGuid ? faqItems.map((o:IFAQ,index:number) => {
      return (<Accordion key={index} title={o.Title} defaultCollapsed={true} >
        {o.Body}
      </Accordion> )
    }) : <Placeholder iconName='Edit'
    iconText='Configure your web part'
    description='Please configure the web part.'
    buttonLabel='Configure'
    onConfigure={() => props.context.propertyPane.open()}
    />}
    </>
   
  )
}

export default Faq