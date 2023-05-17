import {
    defineAbilityFor,
    User,
    UserFields,
    UserRole,
    UserStatus
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
                user.role = UserRole.COACH;
            });

            it('should allow to read user', () => {
                user.id = '1';
                user.municipality = '1';
                const ability = defineAbilityFor(user);
                const usr = new User();

                usr.id = '2';
                usr.status = UserStatus.ACTIVE;
                usr.role = UserRole.PARENT;
                usr.coach = '1';
                usr.municipality = '1';

                expect(ability.can('read', usr, UserFields.ID)).toBeTruthy();
                expect(ability.can('read', usr, UserFields.EMAIL)).toBeTruthy();
                expect(ability.can('read', usr, UserFields.FIRST_NAME)).toBeTruthy();
                expect(ability.can('read', usr, UserFields.LAST_NAME)).toBeTruthy();
                expect(ability.can('read', usr, UserFields.DATE_CREATED)).toBeTruthy();
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
                expect(ability.can('read', usr, UserFields.ROLE)).toBeTruthy();
                expect(ability.can('read', usr, UserFields.FIRST_NAME)).toBeTruthy();
                expect(ability.can('read', usr, UserFields.LAST_NAME)).toBeTruthy();
                expect(ability.can('read', usr, UserFields.DATE_CREATED)).toBeTruthy();
                expect(ability.can('read', usr, UserFields.LAST_ACCESS)).toBeTruthy();
                expect(ability.can('read', usr, UserFields.STATUS)).toBeTruthy();
                expect(ability.can('read', usr, UserFields.EMAIL)).toBeTruthy();
                expect(ability.can('read', usr, UserFields.COACH)).toBeTruthy();
            });

            it('should allow to read user fields email, first_name, last_name, date_created for coaches', () => {
                user.id = '1';
                const ability = defineAbilityFor(user);
                const usr = new User();

                usr.status = UserStatus.ACTIVE;
                usr.role = UserRole.COACH;
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
                usr.role = UserRole.PARENT;
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
                user.role = UserRole.PARENT;
                user.id = '1';
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
                expect(ability.can('read', usr, UserFields.ROLE)).toBeTruthy();
                expect(ability.can('read', usr, UserFields.FIRST_NAME)).toBeTruthy();
                expect(ability.can('read', usr, UserFields.LAST_NAME)).toBeTruthy();
                expect(ability.can('read', usr, UserFields.DATE_CREATED)).toBeTruthy();
                expect(ability.can('read', usr, UserFields.LAST_ACCESS)).toBeTruthy();
                expect(ability.can('read', usr, UserFields.STATUS)).toBeTruthy();
                expect(ability.can('read', usr, UserFields.EMAIL)).toBeTruthy();
                expect(ability.can('read', usr, UserFields.COACH)).toBeTruthy();
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
                usr.role = UserRole.COACH;
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
                usr.role = UserRole.PARENT;
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
                user.role = UserRole.ADMIN;
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
                user.municipality = '1';
                const ability = defineAbilityFor(user);
                const usr = new User();

                usr.id = '2';
                usr.status = UserStatus.SUSPENDED;
                usr.role = UserRole.PARENT;
                usr.municipality = '1';

                expect(ability.can('update', usr, UserFields.COACH)).toBeTruthy();
                expect(ability.can('update', usr, UserFields.STATUS)).toBeTruthy();
                expect(ability.can('update', usr, UserFields.ROLE)).toBeTruthy();
            });

            it('should allow to read user fields id, email, first_name, last_name, date_created for parents', () => {
                user.id = '1';
                user.municipality = '1';
                const ability = defineAbilityFor(user);
                const usr = new User();

                usr.municipality = '1';
                usr.status = UserStatus.ACTIVE;
                usr.role = UserRole.PARENT;
                usr.id = '2';

                expect(ability.can('read', usr, UserFields.ID)).toBeTruthy();
                expect(ability.can('read', usr, UserFields.EMAIL)).toBeTruthy();
                expect(ability.can('read', usr, UserFields.FIRST_NAME)).toBeTruthy();
                expect(ability.can('read', usr, UserFields.LAST_NAME)).toBeTruthy();
                expect(ability.can('read', usr, UserFields.DATE_CREATED)).toBeTruthy();
                expect(ability.can('read', usr, UserFields.ROLE)).toBeTruthy();
                expect(ability.can('read', usr, UserFields.COACH)).toBeTruthy();
            });

            it('should allow to read user fields idm email, first_name, last_name, date_created for coaches', () => {
                user.id = '1';
                user.municipality = '1';
                const ability = defineAbilityFor(user);
                const usr = new User();

                usr.municipality = '1';
                usr.status = UserStatus.ACTIVE;
                usr.role = UserRole.COACH;
                usr.id = '2';

                expect(ability.can('read', usr, UserFields.ID)).toBeTruthy();
                expect(ability.can('read', usr, UserFields.EMAIL)).toBeTruthy();
                expect(ability.can('read', usr, UserFields.FIRST_NAME)).toBeTruthy();
                expect(ability.can('read', usr, UserFields.LAST_NAME)).toBeTruthy();
                expect(ability.can('read', usr, UserFields.DATE_CREATED)).toBeTruthy();
            });
        });
    });
});
