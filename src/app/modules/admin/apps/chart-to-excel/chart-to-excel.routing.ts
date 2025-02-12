import { Route } from '@angular/router';
import { ChartToExcelComponent } from './chart-to-excel.component';

export const chartToExcelRoutes: Route[] = [
    {
        path     : '',
        component: ChartToExcelComponent,
        // resolve  : {
        //     chats   : ChatChatsResolver,
        //     contacts: ChatContactsResolver,
        //     profile : ChatProfileResolver
        // },
        children : [
            {
                path     : '',
                component: ChartToExcelComponent,
                children : [
                    // {
                    //     path     : '',
                    //     pathMatch: 'full',
                    //     component: EmptyConversationComponent
                    // },
                    // {
                    //     path     : ':id',
                    //     component: ConversationComponent,
                    //     resolve  : {
                    //         conversation: ChatChatResolver
                    //     }
                    // }
                ]
            },
        ]
    }
];
