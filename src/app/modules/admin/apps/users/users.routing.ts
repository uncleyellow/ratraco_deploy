import { Route } from '@angular/router';
import { UsersComponent } from './users.component';

export const usersRoutes: Route[] = [
    {
        path     : '',
        component: UsersComponent,
        // resolve  : {
        //     chats   : ChatChatsResolver,
        //     contacts: ChatContactsResolver,
        //     profile : ChatProfileResolver
        // },
        children : [
            {
                path     : '',
                component: UsersComponent,
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
