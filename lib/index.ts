import {
    AbilityBuilder,
    AbilityClass,
    buildMongoQueryMatcher,
    ConditionsMatcher,
    ExtractSubjectType,
    FieldMatcher,
    InferSubjects,
    PureAbility,
} from '@casl/ability';
import { $eq, $in, $ne, $nor, eq, ne, nor, within } from '@ucast/mongo2js';

import { User } from './models/user.model';
import { UserRole } from './enums/user-role.enum';
import { UserFields } from './enums/user-fields.enum';
import { UserStatus } from './enums/user-status.enum';
import { Municipality } from './models/municipality.model';
import { includes, includesAny } from './utilities/array-functions';
import { BehaviorFields } from './enums/behavior-fields.enum';
import { Behavior } from './models/behavior.model';
import { Institution } from './models/institution.model';
import { InstitutionFields } from './enums/institution-fields.enum';

type Action = 'create' | 'read' | 'readALL' | 'update' | 'delete';
type Subjects = InferSubjects<typeof User | typeof Municipality | typeof Behavior>;

type AppAbility = PureAbility<[Action, Subjects]>;

function defineAbilityFor(user: User): PureAbility<[Action, Subjects]> {
    const conditionsMatcher = buildMongoQueryMatcher(
        { $nor, $eq, $ne, $in },
        { nor, eq, ne, within },
    ) as ConditionsMatcher<unknown>;
    const fieldMatcher: FieldMatcher = (fields: any) => (field: any) =>
        fields.includes(field);
    const { can, build, cannot } = new AbilityBuilder<
        PureAbility<[Action, Subjects]>
    >(PureAbility as AbilityClass<AppAbility>);

    const userId: string = (user as any)?.['userId'] || user?.['id'] || user?.id;
    const institution: string = ((user as any)?.['institution'] as any)?.['id'] || (user?.['institution'] as any)?.['id'] || (user?.institution as any)?.id || (user as any)?.['institution'] || user?.['institution'] || user?.institution;

    // User abilities
    {
        // User create abilities
        {
            cannot('create', User);
        }

        // User update abilities
        {
            if (includesAny(user?.roles, [UserRole.PARENT, UserRole.COACH, UserRole.TREATMENT_CENTRE, UserRole.ADMIN])) {
                can(
                    'update',
                    User,
                    [
                        UserFields.PASSWORD,
                        UserFields.FIRST_NAME,
                        UserFields.LAST_NAME,
                    ],
                    {
                        id: { $eq: userId },
                        status: { $eq: UserStatus.ACTIVE },
                    }
                );

                can(
                    'update',
                    User,
                    [
                        UserFields.PASSWORD,
                        UserFields.FIRST_NAME,
                        UserFields.LAST_NAME,
                    ],
                    {
                        'user.id': { $eq: userId },
                        status: { $eq: UserStatus.ACTIVE },
                    }
                );

                cannot(
                    'update',
                    User,
                    [
                        UserFields.ID,
                        UserFields.EMAIL,
                        UserFields.EMAIL_VERIFIED,
                        UserFields.ROLES,
                        UserFields.STATUS,
                        UserFields.DATE_CREATED,
                        UserFields.LAST_ACCESS,
                        UserFields.COACHES,
                        UserFields.MUNICIPALITY,
                        UserFields.INSTITUTION,
                    ],
                    {
                        id: { $eq: userId },
                    }
                );
            }

            if (includes(user?.roles, UserRole.TREATMENT_CENTRE)) {
                can('update', User,
                    [
                        UserFields.COACHES,
                    ],
                    {
                        id: { $ne: userId },
                        roles: { $in: [UserRole.PARENT] },
                        status: { $in: [UserStatus.ACTIVE, UserStatus.INACTIVE, UserStatus.SUSPENDED] },
                        institution: { $eq: institution, $nin: ['', null, undefined] }
                    });

                can('update', User,
                    [
                        UserFields.COACHES,
                    ],
                    {
                        id: { $ne: userId },
                        roles: { $in: [UserRole.PARENT] },
                        status: { $in: [UserStatus.ACTIVE, UserStatus.INACTIVE, UserStatus.SUSPENDED] },
                        'institution.id': { $eq: institution, $nin: ['', null, undefined] }
                    });
            }

            if (includes(user?.roles, UserRole.ADMIN)) {
                can('update', User,
                    [
                        UserFields.ROLES,
                        UserFields.STATUS,
                    ],
                    {
                        id: { $ne: userId },
                        roles: { $in: [UserRole.PARENT, UserRole.COACH, UserRole.TREATMENT_CENTRE] },
                        status: { $in: [UserStatus.ACTIVE, UserStatus.INACTIVE, UserStatus.SUSPENDED] },
                        institution: { $nin: ['', null, undefined] },
                    });

                can('update', User,
                    [
                        UserFields.ROLES,
                        UserFields.STATUS,
                    ],
                    {
                        id: { $ne: userId },
                        roles: { $in: [UserRole.PARENT, UserRole.COACH, UserRole.TREATMENT_CENTRE] },
                        status: { $in: [UserStatus.ACTIVE, UserStatus.INACTIVE, UserStatus.SUSPENDED] },
                        'institution.id': { $nin: ['', null, undefined] },
                    });

                can('update', User,
                    [
                        UserFields.ROLES,
                        UserFields.STATUS,
                    ],
                    {
                        id: { $ne: userId },
                        roles: { $size: 0 },
                        status: { $in: [UserStatus.ACTIVE, UserStatus.INACTIVE, UserStatus.SUSPENDED] },
                        institution: { $nin: ['', null, undefined] },
                    });

                can('update', User,
                    [
                        UserFields.ROLES,
                        UserFields.STATUS,
                    ],
                    {
                        id: { $ne: userId },
                        roles: { $size: 0 },
                        status: { $in: [UserStatus.ACTIVE, UserStatus.INACTIVE, UserStatus.SUSPENDED] },
                        'institution.id': { $nin: ['', null, undefined] },
                    });
            }
        }

        // User delete abilities
        {
            if (includesAny(user?.roles, [UserRole.PARENT, UserRole.COACH, UserRole.TREATMENT_CENTRE, UserRole.ADMIN])) {
                can('delete', User, {
                        id: { $eq: userId },
                        status: { $eq: UserStatus.ACTIVE },
                    }
                );
            }
        }

        // User read abilities
        {
            if (includes(user?.roles, UserRole.ADMIN)) {
                can(
                    'read',
                    User,
                    [
                        UserFields.ID,
                        UserFields.EMAIL_VERIFIED,
                        UserFields.EMAIL,
                        UserFields.FIRST_NAME,
                        UserFields.LAST_NAME,
                        UserFields.DATE_CREATED,
                        UserFields.LAST_ACCESS,
                        UserFields.ROLES,
                        UserFields.STATUS,
                        UserFields.COACHES,
                        UserFields.MUNICIPALITY,
                        UserFields.INSTITUTION,
                    ],
                    {
                        id: { $eq: userId },
                    },
                );

                can(
                    'read',
                    User,
                    [
                        UserFields.ID,
                        UserFields.EMAIL_VERIFIED,
                        UserFields.EMAIL,
                        UserFields.FIRST_NAME,
                        UserFields.LAST_NAME,
                        UserFields.DATE_CREATED,
                        UserFields.LAST_ACCESS,
                        UserFields.ROLES,
                        UserFields.STATUS,
                        UserFields.COACHES,
                        UserFields.MUNICIPALITY,
                        UserFields.INSTITUTION,
                    ],
                    {
                        roles: { $in: [UserRole.PARENT, UserRole.COACH, UserRole.TREATMENT_CENTRE] },
                        institution: { $nin: ['', null, undefined] }
                    },
                );

                can(
                    'read',
                    User,
                    [
                        UserFields.ID,
                        UserFields.EMAIL_VERIFIED,
                        UserFields.EMAIL,
                        UserFields.FIRST_NAME,
                        UserFields.LAST_NAME,
                        UserFields.DATE_CREATED,
                        UserFields.LAST_ACCESS,
                        UserFields.ROLES,
                        UserFields.STATUS,
                        UserFields.COACHES,
                        UserFields.MUNICIPALITY,
                        UserFields.INSTITUTION,
                    ],
                    {
                        roles: { $size: 0 },
                        institution: { $nin: ['', null, undefined] }
                    },
                );
            }

            if (includes(user?.roles, UserRole.TREATMENT_CENTRE)) {
                can(
                    'read',
                    User,
                    [
                        UserFields.ID,
                        UserFields.EMAIL_VERIFIED,
                        UserFields.ROLES,
                        UserFields.EMAIL,
                        UserFields.FIRST_NAME,
                        UserFields.LAST_NAME,
                        UserFields.DATE_CREATED,
                        UserFields.LAST_ACCESS,
                        UserFields.STATUS,
                        UserFields.COACHES,
                        UserFields.MUNICIPALITY,
                        UserFields.INSTITUTION,
                    ],
                    {
                        id: { $eq: userId },
                    },
                );

                can(
                    'read',
                    User,
                    [
                        UserFields.ID,
                        UserFields.EMAIL,
                        UserFields.FIRST_NAME,
                        UserFields.LAST_NAME,
                        UserFields.DATE_CREATED,
                        UserFields.ROLES,
                        UserFields.COACHES,
                        UserFields.MUNICIPALITY,
                        UserFields.INSTITUTION,
                    ],
                    {
                        roles: { $in: [UserRole.PARENT, UserRole.COACH] },
                        institution: { $eq: institution, $nin: ['', null, undefined] }
                    },
                );

                can(
                    'read',
                    User,
                    [
                        UserFields.ID,
                        UserFields.EMAIL,
                        UserFields.FIRST_NAME,
                        UserFields.LAST_NAME,
                        UserFields.DATE_CREATED,
                        UserFields.ROLES,
                        UserFields.COACHES,
                        UserFields.MUNICIPALITY,
                        UserFields.INSTITUTION,
                    ],
                    {
                        roles: { $in: [UserRole.PARENT, UserRole.COACH] },
                        'institution.id': { $eq: institution, $nin: ['', null, undefined] }
                    },
                );
            }

            if (includes(user?.roles, UserRole.PARENT)) {
                can(
                    'read',
                    User,
                    [
                        UserFields.ID,
                        UserFields.EMAIL_VERIFIED,
                        UserFields.ROLES,
                        UserFields.EMAIL,
                        UserFields.FIRST_NAME,
                        UserFields.LAST_NAME,
                        UserFields.DATE_CREATED,
                        UserFields.LAST_ACCESS,
                        UserFields.STATUS,
                        UserFields.COACHES,
                        UserFields.MUNICIPALITY,
                        UserFields.INSTITUTION,
                    ],
                    {
                        id: { $eq: userId },
                    },
                );

                cannot('read', User, { id: { $ne: userId } })
            }

            if (includes(user?.roles, UserRole.COACH)) {
                can(
                    'read',
                    User,
                    [
                        UserFields.ID,
                        UserFields.EMAIL,
                        UserFields.FIRST_NAME,
                        UserFields.LAST_NAME,
                        UserFields.DATE_CREATED,
                        UserFields.MUNICIPALITY,
                        UserFields.INSTITUTION,
                        UserFields.COACHES,
                    ],
                    {
                        status: { $eq: UserStatus.ACTIVE },
                        id: { $ne: userId },
                        roles: { $in: [UserRole.PARENT] },
                        coaches: { $elemMatch: { id: { $eq: userId } } },
                        institution: { $eq: institution, $nin: ['', null, undefined] }
                    },
                );

                can(
                    'read',
                    User,
                    [
                        UserFields.ID,
                        UserFields.EMAIL,
                        UserFields.FIRST_NAME,
                        UserFields.LAST_NAME,
                        UserFields.DATE_CREATED,
                        UserFields.MUNICIPALITY,
                        UserFields.INSTITUTION,
                        UserFields.COACHES,
                    ],
                    {
                        status: { $eq: UserStatus.ACTIVE },
                        id: { $ne: userId },
                        roles: { $in: [UserRole.PARENT] },
                        coaches: { $elemMatch: { id: { $eq: userId } } },
                        'institution.id': { $eq: institution, $nin: ['', null, undefined] }
                    },
                );

                can(
                    'read',
                    User,
                    [
                        UserFields.ID,
                        UserFields.EMAIL_VERIFIED,
                        UserFields.ROLES,
                        UserFields.EMAIL,
                        UserFields.FIRST_NAME,
                        UserFields.LAST_NAME,
                        UserFields.DATE_CREATED,
                        UserFields.LAST_ACCESS,
                        UserFields.STATUS,
                        UserFields.COACHES,
                        UserFields.MUNICIPALITY,
                        UserFields.INSTITUTION,
                    ],
                    {
                        id: { $eq: userId },
                    },
                );
            }

            cannot('read', User, UserFields.PASSWORD);
        }
    }

    // Behavior abilities
    {
        // Behavior create abilities
        {
            if (!user?.roles || user?.roles.length === 0) {
                cannot('create', Behavior);
            }

            if (includes(user?.roles, UserRole.PARENT)) {
                can('create', Behavior, [
                    BehaviorFields.BEHAVIOR,
                    BehaviorFields.DESCRIPTION,
                    BehaviorFields.DESIRED,
                    BehaviorFields.OBSERVERS,
                ]);

                cannot('create', Behavior, [
                    BehaviorFields.ID,
                    BehaviorFields.USER,
                    BehaviorFields.DATE_CREATED,
                    BehaviorFields.DATE_UPDATED,
                ]);
            }
        }

        // Behavior update abilities
        {
            if (!user?.roles || user?.roles.length === 0) {
                cannot('update', Behavior);
            }

            if (includes(user?.roles, UserRole.COACH)) {
                can(
                    'update',
                    Behavior,
                    [
                        BehaviorFields.OBSERVERS,
                    ],
                    {
                        'user.coaches': { $all: [userId] },
                        'user.institution': { $eq: institution, $nin: ['', null, undefined] }
                    },
                );

                can(
                    'update',
                    Behavior,
                    [
                        BehaviorFields.OBSERVERS,
                    ],
                    {
                        'user.coaches': { $all: [userId] },
                        'user.institution.id': { $eq: institution, $nin: ['', null, undefined] }
                    },
                );
            }

            if (includes(user?.roles, UserRole.PARENT)) {
                can(
                    'update',
                    Behavior,
                    [
                        BehaviorFields.BEHAVIOR,
                        BehaviorFields.DESCRIPTION,
                        BehaviorFields.OBSERVATION_METHODS,
                    ],
                    {
                        'user.id': { $eq: userId },
                    },
                );

                can(
                    'update',
                    Behavior,
                    [
                        BehaviorFields.BEHAVIOR,
                        BehaviorFields.DESCRIPTION,
                        BehaviorFields.OBSERVATION_METHODS,
                    ],
                    {
                        observers: { $all: [userId] },
                        'user.institution': { $eq: institution, $nin: ['', null, undefined] },
                    },
                );

                can(
                    'update',
                    Behavior,
                    [
                        BehaviorFields.BEHAVIOR,
                        BehaviorFields.DESCRIPTION,
                        BehaviorFields.OBSERVATION_METHODS,
                    ],
                    {
                        observers: { $elemMatch: { id: { $eq: userId } } },
                        'user.institution': { $eq: institution, $nin: ['', null, undefined] },
                    },
                );

                cannot(
                    'update',
                    Behavior,
                    [BehaviorFields.ID, BehaviorFields.DESIRED, BehaviorFields.USER],
                    {
                        user: { $eq: userId },
                    },
                );
            }
        }

        // Behavior read abilities
        {
            if (!user?.roles || user?.roles.length === 0) {
                cannot('read', Behavior);
            }

            const fields: BehaviorFields[] = [
                BehaviorFields.ID,
                BehaviorFields.USER,
                BehaviorFields.DATE_CREATED,
                BehaviorFields.DATE_UPDATED,
                BehaviorFields.BEHAVIOR,
                BehaviorFields.DESCRIPTION,
                BehaviorFields.DESIRED,
                BehaviorFields.OBSERVATION_METHODS,
                BehaviorFields.OBSERVERS,
            ];

            if (includes(user?.roles, UserRole.PARENT)) {
                can('read', Behavior, fields, {
                    user: { $eq: userId },
                });

                can('read', Behavior, fields, {
                    'user.id': { $eq: userId },
                });

                can('read', Behavior, fields, {
                    observers: { $all: [userId] },
                });

                can('read', Behavior, fields, {
                    observers: { $elemMatch: { id: { $eq: userId } } },
                });
            }

            if (includes(user?.roles, UserRole.COACH)) {
                can('read', Behavior, fields, {
                    'user.coaches': { $all: [userId] },
                    'user.institution': { $eq: institution, $nin: ['', null, undefined] }
                });
            }

        }

        // Behavior delete abilities
        {
            if (!user?.roles || user?.roles.length === 0) {
                cannot('delete', Behavior);
            }

            if (includes(user?.roles, UserRole.PARENT)) {
                can('delete', Behavior, {
                    'user.id': { $eq: userId },
                });

                can('delete', Behavior, {
                    user: { $eq: userId },
                });
            }

        }
    }

    return build({
        detectSubjectType: (item: any) =>
            item.constructor as ExtractSubjectType<Subjects>,
        conditionsMatcher,
        fieldMatcher,
    });
}

export {
    AppAbility,
    defineAbilityFor,
    User,
    UserFields,
    UserRole,
    UserStatus,
    Action,
    Subjects,
    Municipality,
    BehaviorFields,
    Behavior,
    Institution,
    InstitutionFields,
}