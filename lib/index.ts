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

import { User } from './user.model';
import { UserRole } from './enums/user-role.enum';
import { UserFields } from './enums/user-fields.enum';
import { UserStatus } from './enums/user-status.enum';
import { Municipality } from './municipality.model';

type Action = 'create' | 'read' | 'readALL' | 'update' | 'delete';
type Subjects = InferSubjects<typeof User | typeof Municipality>;

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
    const municipality: string = (user as any)?.['municipality'] || user?.['municipality'] || user?.municipality;

    // User abilities
    {
        // User create abilities
        {
            cannot('create', User);
        }

        // User update abilities
        {
            if (user?.role === UserRole.PARENT ||
                user?.role === UserRole.COACH ||
                user?.role === UserRole.ADMIN) {
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

                cannot(
                    'update',
                    User,
                    [
                        UserFields.ID,
                        UserFields.EMAIL,
                        UserFields.EMAIL_VERIFIED,
                        UserFields.ROLE,
                        UserFields.STATUS,
                        UserFields.DATE_CREATED,
                        UserFields.LAST_ACCESS,
                        UserFields.COACH,
                        UserFields.MUNICIPALITY,
                    ],
                    {
                        id: { $eq: userId },
                    }
                );
            }

            if (user?.role === UserRole.ADMIN) {
                can('update', User,
                    [
                        UserFields.COACH,
                        UserFields.STATUS,
                        UserFields.ROLE,
                    ],
                    {
                        id: { $ne: userId },
                        role: { $eq: UserRole.PARENT },
                        status: { $in: [UserStatus.ACTIVE, UserStatus.INACTIVE, UserStatus.SUSPENDED] },
                        municipality: { $eq: municipality, $nin: ['', null, undefined] }
                    });

                can('update', User,
                    [
                        UserFields.COACH,
                        UserFields.STATUS,
                        UserFields.ROLE,
                    ],
                    {
                        id: { $ne: userId },
                        role: { $eq: UserRole.PARENT },
                        status: { $in: [UserStatus.ACTIVE, UserStatus.INACTIVE, UserStatus.SUSPENDED] },
                        'municipality.id': { $eq: municipality, $nin: ['', null, undefined] }
                    });
            }
        }

        // User delete abilities
        {
            cannot('delete', User);
        }

        // User read abilities
        {
            if (user?.role === UserRole.ADMIN) {
                can(
                    'read',
                    User,
                    [
                        UserFields.ID,
                        UserFields.EMAIL_VERIFIED,
                        UserFields.ROLE,
                        UserFields.EMAIL,
                        UserFields.FIRST_NAME,
                        UserFields.LAST_NAME,
                        UserFields.DATE_CREATED,
                        UserFields.LAST_ACCESS,
                        UserFields.STATUS,
                        UserFields.COACH,
                        UserFields.MUNICIPALITY,
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
                        UserFields.ROLE,
                        UserFields.COACH,
                        UserFields.MUNICIPALITY,
                    ],
                    {
                        role: { $in: [UserRole.PARENT, UserRole.COACH] },
                        municipality: { $eq: municipality, $nin: ['', null, undefined] }
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
                        UserFields.ROLE,
                        UserFields.COACH,
                        UserFields.MUNICIPALITY,
                    ],
                    {
                        role: { $in: [UserRole.PARENT, UserRole.COACH] },
                        'municipality.id': { $eq: municipality, $nin: ['', null, undefined] }
                    },
                );
            }

            if (user?.role === UserRole.PARENT) {
                can(
                    'read',
                    User,
                    [
                        UserFields.ID,
                        UserFields.EMAIL_VERIFIED,
                        UserFields.ROLE,
                        UserFields.EMAIL,
                        UserFields.FIRST_NAME,
                        UserFields.LAST_NAME,
                        UserFields.DATE_CREATED,
                        UserFields.LAST_ACCESS,
                        UserFields.STATUS,
                        UserFields.COACH,
                        UserFields.MUNICIPALITY,
                    ],
                    {
                        id: { $eq: userId },
                    },
                );

                cannot('read', User, { id: { $ne: userId } })
            }

            if (user?.role === UserRole.COACH) {
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
                    ],
                    {
                        status: { $eq: UserStatus.ACTIVE },
                        id: { $ne: userId },
                        role: { $eq: UserRole.PARENT },
                        'coach.id': { $eq: userId },
                        municipality: { $eq: municipality, $nin: ['', null, undefined] }
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
                    ],
                    {
                        status: { $eq: UserStatus.ACTIVE },
                        id: { $ne: userId },
                        role: { $eq: UserRole.PARENT },
                        'coach.id': { $eq: userId },
                        'municipality.id': { $eq: municipality, $nin: ['', null, undefined] }
                    },
                );

                can(
                    'read',
                    User,
                    [
                        UserFields.ID,
                        UserFields.EMAIL_VERIFIED,
                        UserFields.ROLE,
                        UserFields.EMAIL,
                        UserFields.FIRST_NAME,
                        UserFields.LAST_NAME,
                        UserFields.DATE_CREATED,
                        UserFields.LAST_ACCESS,
                        UserFields.STATUS,
                        UserFields.COACH,
                        UserFields.MUNICIPALITY,
                    ],
                    {
                        id: { $eq: userId },
                    },
                );
            }

            cannot('read', User, UserFields.PASSWORD);
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
}