/* tslint:disable:max-line-length */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
    {
        id      : 'apps',
        title   : 'Applications',
        subtitle: 'Custom made application designs',
        type    : 'group',
        icon    : 'heroicons_outline:home',
        children: [
            {
                id   : 'apps.home',
                title: 'Trang chủ',
                type : 'basic',
                icon : 'heroicons_outline:view-boards',
                link : '/home'
            },
            {
                id   : 'apps.chat',
                title: 'Chat',
                type : 'basic',
                icon : 'heroicons_outline:chat-alt',
                link : '/apps/chat'
            },
            {
                id   : 'apps.mailbox',
                title: 'Mailbox',
                type : 'basic',
                icon : 'heroicons_outline:mail',
                link : '/apps/mailbox',
                badge: {
                    title  : '27',
                    classes: 'px-2 bg-pink-600 text-white rounded-full'
                }
            },
            {
                id   : 'apps.scrumboard',
                title: 'Scrumboard',
                type : 'basic',
                icon : 'heroicons_outline:view-boards',
                link : '/apps/scrumboard'
            },
            {
                id   : 'apps.chartToExcel',
                title: 'Biểu đồ',
                type : 'basic',
                icon : 'heroicons_outline:view-boards',
                link : '/apps/chart-to-excel'
            },
            {
                id   : 'profile',
                title: 'Profile',
                type : 'basic',
                icon : 'heroicons_outline:chart-pie',
                link : '/apps/profile'
            },
            {
                id   : 'users',
                title: 'Users',
                type : 'basic',
                icon : 'heroicons_outline:chart-pie',
                link : '/apps/users'
            },
            {
                id   : 'video-call',
                title: 'Video Call',
                type : 'basic',
                icon : 'heroicons_outline:chart-pie',
                link : '/apps/video-call'
            },
        ]
    },
];
export const compactNavigation: FuseNavigationItem[] = [
    {
        id      : 'apps',
        title   : 'Applications',
        subtitle: 'Custom made application designs',
        type    : 'group',
        icon    : 'heroicons_outline:home',
        children: [
            {
                id   : 'apps.home',
                title: 'Trang chủ',
                type : 'basic',
                icon : 'heroicons_outline:view-boards',
                link : '/home'
            },
            {
                id   : 'apps.chat',
                title: 'Chat',
                type : 'basic',
                icon : 'heroicons_outline:chat-alt',
                link : '/apps/chat'
            },
            {
                id   : 'apps.mailbox',
                title: 'Mailbox',
                type : 'basic',
                icon : 'heroicons_outline:mail',
                link : '/apps/mailbox',
                badge: {
                    title  : '27',
                    classes: 'px-2 bg-pink-600 text-white rounded-full'
                }
            },
            {
                id   : 'apps.scrumboard',
                title: 'Scrumboard',
                type : 'basic',
                icon : 'heroicons_outline:view-boards',
                link : '/apps/scrumboard'
            },
            {
                id   : 'apps.chartToExcel',
                title: 'Biểu đồ',
                type : 'basic',
                icon : 'heroicons_outline:view-boards',
                link : '/apps/chart-to-excel'
            },
            {
                id   : 'profile',
                title: 'Profile',
                type : 'basic',
                icon : 'heroicons_outline:chart-pie',
                link : '/apps/profile'
            },
            {
                id   : 'users',
                title: 'Users',
                type : 'basic',
                icon : 'heroicons_outline:chart-pie',
                link : '/apps/users'
            },
            {
                id   : 'video-call',
                title: 'Video Call',
                type : 'basic',
                icon : 'heroicons_outline:chart-pie',
                link : '/apps/video-call'
            },
        ]
    },
];
export const futuristicNavigation: FuseNavigationItem[] = [
    {
        id      : 'apps',
        title   : 'Applications',
        subtitle: 'Custom made application designs',
        type    : 'group',
        icon    : 'heroicons_outline:home',
        children: [
            {
                id   : 'apps.home',
                title: 'Trang chủ',
                type : 'basic',
                icon : 'heroicons_outline:view-boards',
                link : '/home'
            },
            {
                id   : 'apps.chat',
                title: 'Chat',
                type : 'basic',
                icon : 'heroicons_outline:chat-alt',
                link : '/apps/chat'
            },
            {
                id   : 'apps.mailbox',
                title: 'Mailbox',
                type : 'basic',
                icon : 'heroicons_outline:mail',
                link : '/apps/mailbox',
                badge: {
                    title  : '27',
                    classes: 'px-2 bg-pink-600 text-white rounded-full'
                }
            },
            {
                id   : 'apps.scrumboard',
                title: 'Scrumboard',
                type : 'basic',
                icon : 'heroicons_outline:view-boards',
                link : '/apps/scrumboard'
            },
            {
                id   : 'apps.chartToExcel',
                title: 'Biểu đồ',
                type : 'basic',
                icon : 'heroicons_outline:view-boards',
                link : '/apps/chart-to-excel'
            },
            {
                id   : 'profile',
                title: 'Profile',
                type : 'basic',
                icon : 'heroicons_outline:chart-pie',
                link : '/apps/profile'
            },
            {
                id   : 'users',
                title: 'Users',
                type : 'basic',
                icon : 'heroicons_outline:chart-pie',
                link : '/apps/users'
            },
            {
                id   : 'video-call',
                title: 'Video Call',
                type : 'basic',
                icon : 'heroicons_outline:chart-pie',
                link : '/apps/video-call'
            },
        ]
    },
];
export const horizontalNavigation: FuseNavigationItem[] = [
    {
        id      : 'apps',
        title   : 'Applications',
        subtitle: 'Custom made application designs',
        type    : 'group',
        icon    : 'heroicons_outline:home',
        children: [
            {
                id   : 'apps.home',
                title: 'Trang chủ',
                type : 'basic',
                icon : 'heroicons_outline:view-boards',
                link : '/home'
            },
            {
                id   : 'apps.chat',
                title: 'Chat',
                type : 'basic',
                icon : 'heroicons_outline:chat-alt',
                link : '/apps/chat'
            },
            {
                id   : 'apps.mailbox',
                title: 'Mailbox',
                type : 'basic',
                icon : 'heroicons_outline:mail',
                link : '/apps/mailbox',
                badge: {
                    title  : '27',
                    classes: 'px-2 bg-pink-600 text-white rounded-full'
                }
            },
            {
                id   : 'apps.scrumboard',
                title: 'Scrumboard',
                type : 'basic',
                icon : 'heroicons_outline:view-boards',
                link : '/apps/scrumboard'
            },
            {
                id   : 'apps.chartToExcel',
                title: 'Biểu đồ',
                type : 'basic',
                icon : 'heroicons_outline:view-boards',
                link : '/apps/chart-to-excel'
            },
            {
                id   : 'profile',
                title: 'Profile',
                type : 'basic',
                icon : 'heroicons_outline:chart-pie',
                link : '/apps/profile'
            },
            {
                id   : 'users',
                title: 'Users',
                type : 'basic',
                icon : 'heroicons_outline:chart-pie',
                link : '/apps/users'
            },
            {
                id   : 'video-call',
                title: 'Video Call',
                type : 'basic',
                icon : 'heroicons_outline:chart-pie',
                link : '/apps/video-call'
            },
        ]
    },
];
