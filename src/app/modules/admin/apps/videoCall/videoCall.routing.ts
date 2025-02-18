import { Route } from '@angular/router';
import { MeetingRoomComponent } from './videoCall.component';

export const videoCallRoutes: Route[] = [
    {
        path     : '',
        component: MeetingRoomComponent,
        // resolve  : {
        //     chats   : ChatChatsResolver,
        //     contacts: ChatContactsResolver,
        //     profile : ChatProfileResolver
        // },
        children : [
            {
                path     : '',
                component: MeetingRoomComponent,
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
