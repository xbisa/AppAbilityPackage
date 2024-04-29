import {
    defineAbilityFor,
    User,
    UserFields,
    UserRole,
    UserStatus,
    Behavior,
    BehaviorFields,
    Institution,
} from './lib';
import { beforeEach, describe, expect, it } from '@jest/globals';

describe('defineAbilityFor', () => {
    let user: any;

    // User
    describe('User', () => {
        beforeEach(() => {
            user = new User();
        });

        describe(UserRole.COACH, () => {
            beforeEach(() => {
                user.roles = [UserRole.COACH];
            });

            it('should allow to read user', () => {
                user.id = '1';
                user.institution = { id: '1' } as Institution;
                const ability = defineAbilityFor(user);
                const usr = new User();

                usr.id = '2';
                usr.status = UserStatus.ACTIVE;
                usr.roles = [UserRole.PARENT];
                usr.coaches = [{
                    id: '1',
                    coaches: null,
                    last_name: '',
                    roles: [UserRole.COACH],
                    institution: '1',
                    date_created: new Date(),
                    first_name: '',
                    email: '',
                    email_verified: false,
                    last_access: new Date(),
                    status: UserStatus.ACTIVE,
                    municipality: '1',
                    password: ''
                }];
                usr.institution = '1';

                expect(ability.can('read', usr, UserFields.ID)).toBeTruthy();
                expect(ability.can('read', usr, UserFields.EMAIL)).toBeTruthy();
                expect(ability.can('read', usr, UserFields.FIRST_NAME)).toBeTruthy();
                expect(ability.can('read', usr, UserFields.LAST_NAME)).toBeTruthy();
                expect(ability.can('read', usr, UserFields.DATE_CREATED)).toBeTruthy();
                expect(ability.can('read', usr, UserFields.COACHES)).toBeTruthy();
            });

            it('should not allow to delete user', () => {
                user.id = '1';
                user.institution = { id: '1' } as Institution;

                const ability = defineAbilityFor(user);
                const usr = new User();

                usr.id = '2';
                usr.status = UserStatus.ACTIVE;
                usr.roles = [UserRole.PARENT];
                usr.coaches = [{
                    id: '1',
                    coaches: null,
                    last_name: '',
                    roles: [UserRole.COACH],
                    institution: '1',
                    date_created: new Date(),
                    first_name: '',
                    email: '',
                    email_verified: false,
                    last_access: new Date(),
                    status: UserStatus.ACTIVE,
                    municipality: '1',
                    password: ''
                }];
                usr.institution = '1';

                expect(ability.cannot('delete', usr)).toBeTruthy();
            });

            it('should not allow to create user', () => {
                const ability = defineAbilityFor(user);
                const usr = new User();

                expect(ability.cannot('create', usr)).toBeTruthy();
            });

            it('coach should allow to update own first name, lastname and password', () => {
                user.id = '1';
                const ability = defineAbilityFor(user);
                const usr = new User();

                usr.id = '1';
                usr.status = UserStatus.ACTIVE;

                expect(ability.can('update', usr, UserFields.FIRST_NAME)).toBeTruthy();
                expect(ability.can('update', usr, UserFields.LAST_NAME)).toBeTruthy();
                expect(ability.can('update', usr, UserFields.PASSWORD)).toBeTruthy();
            });

            it('coach should not allow to update own email', () => {
                user.id = '1';
                const ability = defineAbilityFor(user);
                const usr = new User();

                usr.id = '1';
                usr.status = UserStatus.ACTIVE;

                expect(ability.cannot('update', usr, UserFields.EMAIL)).toBeTruthy();
            });

            it('should allow to read user', () => {
                user.id = '1';
                const ability = defineAbilityFor(user);
                const usr = new User();
                usr.id = '1';

                expect(ability.can('read', usr, UserFields.ID)).toBeTruthy();
                expect(
                    ability.can('read', usr, UserFields.EMAIL_VERIFIED),
                ).toBeTruthy();
                expect(ability.can('read', usr, UserFields.ROLES)).toBeTruthy();
                expect(ability.can('read', usr, UserFields.FIRST_NAME)).toBeTruthy();
                expect(ability.can('read', usr, UserFields.LAST_NAME)).toBeTruthy();
                expect(ability.can('read', usr, UserFields.DATE_CREATED)).toBeTruthy();
                expect(ability.can('read', usr, UserFields.LAST_ACCESS)).toBeTruthy();
                expect(ability.can('read', usr, UserFields.STATUS)).toBeTruthy();
                expect(ability.can('read', usr, UserFields.EMAIL)).toBeTruthy();
                expect(ability.can('read', usr, UserFields.COACHES)).toBeTruthy();
            });

            it('should allow to read user fields email, first_name, last_name, date_created for coaches', () => {
                user.id = '1';
                const ability = defineAbilityFor(user);
                const usr = new User();

                usr.status = UserStatus.ACTIVE;
                usr.roles = [UserRole.COACH];
                usr.id = '2';

                expect(ability.cannot('read', usr, UserFields.ID)).toBeTruthy();
                expect(ability.cannot('read', usr, UserFields.EMAIL)).toBeTruthy();
                expect(ability.cannot('read', usr, UserFields.FIRST_NAME)).toBeTruthy();
                expect(ability.cannot('read', usr, UserFields.LAST_NAME)).toBeTruthy();
                expect(ability.cannot('read', usr, UserFields.DATE_CREATED)).toBeTruthy();
            });

            it('should allow to read user fields email, first_name, last_name, date_created for coaches', () => {
                user.id = '1';
                const ability = defineAbilityFor(user);
                const usr = new User();

                usr.status = UserStatus.ACTIVE;
                usr.roles = [UserRole.PARENT];
                usr.id = '2';

                expect(ability.cannot('read', usr, UserFields.ID)).toBeTruthy();
                expect(ability.cannot('read', usr, UserFields.EMAIL)).toBeTruthy();
                expect(ability.cannot('read', usr, UserFields.FIRST_NAME)).toBeTruthy();
                expect(ability.cannot('read', usr, UserFields.LAST_NAME)).toBeTruthy();
                expect(ability.cannot('read', usr, UserFields.DATE_CREATED)).toBeTruthy();
            });
        });

        describe(UserRole.PARENT, () => {
            beforeEach(() => {
                user.roles = [UserRole.PARENT];
                user.id = '1';
            });

            it('parent should allow to delete own user', () => {
                user.id = '1';
                const ability = defineAbilityFor(user);
                const usr = new User();

                usr.id = '1';
                usr.status = UserStatus.ACTIVE;

                expect(ability.can('delete', usr)).toBeTruthy();
            });

            it('parent should allow to update own first name, lastname and password', () => {
                user.id = '1';
                const ability = defineAbilityFor(user);
                const usr = new User();

                usr.id = '1';
                usr.status = UserStatus.ACTIVE;

                expect(ability.can('update', usr, UserFields.FIRST_NAME)).toBeTruthy();
                expect(ability.can('update', usr, UserFields.LAST_NAME)).toBeTruthy();
                expect(ability.can('update', usr, UserFields.PASSWORD)).toBeTruthy();
            });

            it('should allow to read user', () => {
                const ability = defineAbilityFor(user);
                const usr = new User();
                usr.id = '1';

                expect(ability.can('read', usr, UserFields.ID)).toBeTruthy();
                expect(
                    ability.can('read', usr, UserFields.EMAIL_VERIFIED),
                ).toBeTruthy();
                expect(ability.can('read', usr, UserFields.ROLES)).toBeTruthy();
                expect(ability.can('read', usr, UserFields.FIRST_NAME)).toBeTruthy();
                expect(ability.can('read', usr, UserFields.LAST_NAME)).toBeTruthy();
                expect(ability.can('read', usr, UserFields.DATE_CREATED)).toBeTruthy();
                expect(ability.can('read', usr, UserFields.LAST_ACCESS)).toBeTruthy();
                expect(ability.can('read', usr, UserFields.STATUS)).toBeTruthy();
                expect(ability.can('read', usr, UserFields.EMAIL)).toBeTruthy();
                expect(ability.can('read', usr, UserFields.COACHES)).toBeTruthy();
            });

            it('should not allow to read own user password', () => {
                const ability = defineAbilityFor(user);
                const usr = new User();
                usr.id = '1';

                expect(ability.cannot('read', usr, UserFields.PASSWORD)).toBeTruthy();
            });

            it('should not allow to create user', () => {
                const ability = defineAbilityFor(user);
                const usr = new User();

                expect(ability.cannot('create', usr)).toBeTruthy();
            });

            it('should allow to read user fields email, first_name, last_name, date_created for coaches', () => {
                const ability = defineAbilityFor(user);
                const usr = new User();

                usr.status = UserStatus.ACTIVE;
                usr.roles = [UserRole.COACH];
                usr.id = '2';

                expect(ability.cannot('read', usr, UserFields.ID)).toBeTruthy();
                expect(ability.cannot('read', usr, UserFields.EMAIL)).toBeTruthy();
                expect(ability.cannot('read', usr, UserFields.FIRST_NAME)).toBeTruthy();
                expect(ability.cannot('read', usr, UserFields.LAST_NAME)).toBeTruthy();
                expect(ability.cannot('read', usr, UserFields.DATE_CREATED)).toBeTruthy();
            });

            it('should allow to read user fields email, first_name, last_name, date_created for coaches', () => {
                const ability = defineAbilityFor(user);
                const usr = new User();

                usr.status = UserStatus.ACTIVE;
                usr.roles = [UserRole.PARENT];
                usr.id = '2';

                expect(ability.cannot('read', usr, UserFields.ID)).toBeTruthy();
                expect(ability.cannot('read', usr, UserFields.EMAIL)).toBeTruthy();
                expect(ability.cannot('read', usr, UserFields.FIRST_NAME)).toBeTruthy();
                expect(ability.cannot('read', usr, UserFields.LAST_NAME)).toBeTruthy();
                expect(ability.cannot('read', usr, UserFields.DATE_CREATED)).toBeTruthy();
            });
        });

        describe(UserRole.ADMIN, () => {
            beforeEach(() => {
                user.roles = [UserRole.ADMIN];
            });

            it('should allow to update roles for any user', () => {
                user.id = '1';
                user.institution = { id: '1' } as Institution;
                const ability = defineAbilityFor(user);
                const usr = new User();

                usr.id = '2';
                usr.status = UserStatus.SUSPENDED;
                usr.roles = [];
                usr.institution = '2';

                expect(ability.can('update', usr, UserFields.ROLES)).toBeTruthy();
            });

            it('should allow to read user fields id, email, first_name, last_name, date_created for any user', () => {
                user.id = '1';
                user.institution = { id: '1' } as Institution;
                const ability = defineAbilityFor(user);
                const usr = new User();

                usr.institution = '2';
                usr.status = UserStatus.INACTIVE;
                usr.roles = [];
                usr.id = '2';

                expect(ability.can('read', usr, UserFields.ID)).toBeTruthy();
                expect(ability.can('read', usr, UserFields.EMAIL)).toBeTruthy();
                expect(ability.can('read', usr, UserFields.FIRST_NAME)).toBeTruthy();
                expect(ability.can('read', usr, UserFields.LAST_NAME)).toBeTruthy();
                expect(ability.can('read', usr, UserFields.DATE_CREATED)).toBeTruthy();
                expect(ability.can('read', usr, UserFields.ROLES)).toBeTruthy();
                expect(ability.can('read', usr, UserFields.COACHES)).toBeTruthy();
            });
        });

        describe(UserRole.TREATMENT_CENTRE, () => {
            beforeEach(() => {
                user.roles = [UserRole.TREATMENT_CENTRE];
            });

            it('should allow to update own first name, lastname and password', () => {
                user.id = '1';
                const ability = defineAbilityFor(user);
                const usr = new User();

                usr.id = '1';
                usr.status = UserStatus.ACTIVE;

                expect(ability.can('update', usr, UserFields.FIRST_NAME)).toBeTruthy();
                expect(ability.can('update', usr, UserFields.LAST_NAME)).toBeTruthy();
                expect(ability.can('update', usr, UserFields.PASSWORD)).toBeTruthy();
            });

            it('should not allow to create user', () => {
                const ability = defineAbilityFor(user);
                const usr = new User();

                expect(ability.cannot('create', usr)).toBeTruthy();
            });

            it('should allow to update user fields coach and status for parents', () => {
                user.id = '1';
                user.institution = { id: '1' } as Institution;
                const ability = defineAbilityFor(user);
                const usr = new User();

                usr.id = '2';
                usr.status = UserStatus.SUSPENDED;
                usr.roles = [UserRole.PARENT];
                usr.institution = '1';

                expect(ability.can('update', usr, UserFields.COACHES)).toBeTruthy();
            });

            it('should allow to read user fields id, email, first_name, last_name, date_created for parents', () => {
                user.id = '1';
                user.institution = { id: '1' } as Institution;
                const ability = defineAbilityFor(user);
                const usr = new User();

                usr.institution = '1';
                usr.status = UserStatus.ACTIVE;
                usr.roles = [UserRole.PARENT];
                usr.id = '2';

                expect(ability.can('read', usr, UserFields.ID)).toBeTruthy();
                expect(ability.can('read', usr, UserFields.EMAIL)).toBeTruthy();
                expect(ability.can('read', usr, UserFields.FIRST_NAME)).toBeTruthy();
                expect(ability.can('read', usr, UserFields.LAST_NAME)).toBeTruthy();
                expect(ability.can('read', usr, UserFields.DATE_CREATED)).toBeTruthy();
                expect(ability.can('read', usr, UserFields.ROLES)).toBeTruthy();
                expect(ability.can('read', usr, UserFields.COACHES)).toBeTruthy();
            });

            it('should allow to read user fields idm email, first_name, last_name, date_created for coaches', () => {
                user.id = '1';
                user.institution = { id: '1' } as Institution;
                const ability = defineAbilityFor(user);
                const usr = new User();

                usr.institution = '1';
                usr.status = UserStatus.ACTIVE;
                usr.roles = [UserRole.COACH];
                usr.id = '2';

                expect(ability.can('read', usr, UserFields.ID)).toBeTruthy();
                expect(ability.can('read', usr, UserFields.EMAIL)).toBeTruthy();
                expect(ability.can('read', usr, UserFields.FIRST_NAME)).toBeTruthy();
                expect(ability.can('read', usr, UserFields.LAST_NAME)).toBeTruthy();
                expect(ability.can('read', usr, UserFields.DATE_CREATED)).toBeTruthy();
            });
        });
    });
    // Behavior
    describe('Behaviors', () => {
        beforeEach(() => {
            user = new User();
        });

        describe('unauthorized user', () => {
            beforeEach(() => {
                user.roles = [];
            });

            it('should not allow to create behavior', () => {
                const ability = defineAbilityFor(user);
                const behavior = new Behavior();

                expect(ability.cannot('create', behavior)).toBeTruthy();
            });
        });

        describe(UserRole.PARENT, () => {
            beforeEach(() => {
                user.roles = [UserRole.PARENT, UserRole.COACH];
            });

            it('should allow to create Behavior', () => {
                const ability = defineAbilityFor(user);
                const behavior = new Behavior();

                expect(
                    ability.can('create', behavior, BehaviorFields.BEHAVIOR),
                ).toBeTruthy();
                expect(
                    ability.can('create', behavior, BehaviorFields.DESCRIPTION),
                ).toBeTruthy();
                expect(
                    ability.can('create', behavior, BehaviorFields.DESIRED),
                ).toBeTruthy();
            });

            it('should not allow to create Behavior', () => {
                const ability = defineAbilityFor(user);
                const behavior = new Behavior();

                expect(
                    ability.cannot('create', behavior, BehaviorFields.USER),
                ).toBeTruthy();
                expect(
                    ability.cannot('create', behavior, BehaviorFields.ID),
                ).toBeTruthy();
            });

            it('should allow to read own Behavior', () => {
                user.id = '1';
                const ability = defineAbilityFor(user);
                const behavior = new Behavior();
                behavior.user = '1';
                expect(ability.can('read', behavior)).toBeTruthy();
            });

            it('should not allow to read other\'s Behavior', () => {
                user.id = '2';
                const ability = defineAbilityFor(user);
                const behavior = new Behavior();
                behavior.user = '1';
                expect(ability.cannot('read', behavior)).toBeTruthy();
            });

            it('observer should allow to read other\'s Behavior', () => {
                user.id = '2';
                user.institution = '3';
                const ability = defineAbilityFor(user);
                const behavior = new Behavior();
                behavior.user = new User();
                behavior.user.id = '1';
                behavior.observers = ['2'];
                behavior.user.institution = '3';
                expect(ability.can('read', behavior)).toBeTruthy();
            });

            it('should not allow to update other\'s Behavior', () => {
                user.id = '1';
                const ability = defineAbilityFor(user);

                const behavior = new Behavior();
                behavior.user = '2';
                behavior.behavior = 'test';

                expect(ability.cannot('update', behavior)).toBeTruthy();
            });

            it('should allow to update own Behavior', () => {
                user.id = '1';
                const ability = defineAbilityFor(user);

                const behavior = new Behavior();
                behavior.user = '1';

                expect(
                    ability.can('update', behavior, BehaviorFields.BEHAVIOR),
                ).toBeTruthy();
                expect(
                    ability.can('update', behavior, BehaviorFields.DESCRIPTION),
                ).toBeTruthy();
            });

            it('should not allow to update own Behavior forbidden fields', () => {
                user.id = '1';
                const ability = defineAbilityFor(user);

                const behavior = new Behavior();
                behavior.user = '1';

                expect(
                    ability.cannot('update', behavior, BehaviorFields.ID),
                ).toBeTruthy();
                expect(
                    ability.cannot('update', behavior, BehaviorFields.DESIRED),
                ).toBeTruthy();
                expect(
                    ability.cannot('update', behavior, BehaviorFields.USER),
                ).toBeTruthy();
            });

            it('should not allow to delete other\'s Behavior', () => {
                user.id = '1';
                const ability = defineAbilityFor(user);

                const behavior = new Behavior();
                behavior.user = '2';
                behavior.behavior = 'test';

                expect(ability.cannot('delete', behavior)).toBeTruthy();
            });

            it('should allow to delete own Behavior', () => {
                user.id = '1';
                const ability = defineAbilityFor(user);

                const behavior = new Behavior();
                behavior.user = '1';

                expect(ability.can('delete', behavior)).toBeTruthy();
            });
        });

        describe(UserRole.COACH, () => {
            beforeEach(() => {
                user.roles = [UserRole.COACH];
            });

            it('should not allow to create Behavior', () => {
                const ability = defineAbilityFor(user);
                const behavior = new Behavior();

                expect(ability.cannot('create', behavior)).toBeTruthy();
            });

            it('should allow to read Behavior', () => {
                user.id = '5';
                user.institution = { id: '1' } as Institution;
                const ability = defineAbilityFor(user);
                const behavior = new Behavior();
                behavior.user = new User();
                behavior.user.coaches = ['5'];
                behavior.user.institution = '1';

                expect(ability.can('read', behavior)).toBeTruthy();
            });

            it('should not allow to delete Behavior', () => {
                const ability = defineAbilityFor(user);
                const behavior = new Behavior();

                expect(ability.cannot('delete', behavior)).toBeTruthy();
            });
        });

        describe(UserRole.TREATMENT_CENTRE, () => {
            beforeEach(() => {
                user.roles = [UserRole.TREATMENT_CENTRE];
            });

            it('should not allow to create Behavior', () => {
                const ability = defineAbilityFor(user);
                const behavior = new Behavior();

                expect(ability.cannot('create', behavior)).toBeTruthy();
            });

            it('should not allow to read Behavior', () => {
                const ability = defineAbilityFor(user);
                const behavior = new Behavior();

                expect(ability.cannot('read', behavior)).toBeTruthy();
            });

            it('should not allow to delete Behavior', () => {
                const ability = defineAbilityFor(user);
                const behavior = new Behavior();

                expect(ability.cannot('delete', behavior)).toBeTruthy();
            });
        });
    });
});
