import { css } from '@emotion/css';
import React from 'react';

import { Button, Field, Form, HorizontalGroup, LinkButton } from '@grafana/ui';
import config from 'app/core/config';
import { UserDTO } from 'app/types';

import { t } from 'i18next';

import { PasswordField } from '../../core/components/PasswordField/PasswordField';

import { ChangePasswordFields } from './types';

export interface Props {
  user: UserDTO;
  isSaving: boolean;
  onChangePassword: (payload: ChangePasswordFields) => void;
}

export const ChangePasswordForm = ({ user, onChangePassword, isSaving }: Props) => {
  const { disableLoginForm } = config;
  const authSource = user.authLabels?.length && user.authLabels[0];

  if (authSource === 'LDAP' || authSource === 'Auth Proxy') {
    return <p>You cannot change password when signed in with LDAP or auth proxy.</p>;
  }
  if (authSource && disableLoginForm) {
    return <p>Password cannot be changed here.</p>;
  }

  return (
    <div
      className={css`
        max-width: 400px;
      `}
    >
      <Form onSubmit={onChangePassword}>
        {({ register, errors, getValues }) => {
          return (
            <>
              <Field label={ t("change-password-form.old-password","Old password") } invalid={!!errors.oldPassword} error={errors?.oldPassword?.message}>
                <PasswordField
                  id="current-password"
                  autoComplete="current-password"
                  {...register('oldPassword', { required: t( "change-password-form.errors.old-password-required",'Old password is required') })}
                />
              </Field>

              <Field label={ t("change-password-form.new-password","New password") } invalid={!!errors.newPassword} error={errors?.newPassword?.message}>
                <PasswordField
                  id="new-password"
                  autoComplete="new-password"
                  {...register('newPassword', {
                    required: t( "change-password-form.errors.new-password-required",'New password is required'),
                    validate: {
                      confirm: (v) => v === getValues().confirmNew || t("change-password-form.errors.password-must-match",'Passwords must match'),
                      old: (v) => v !== getValues().oldPassword || t("change-password-form.errors.new-password-must-diff-old-password",`New password can't be the same as the old one`),
                    },
                  })}
                />
              </Field>

              <Field label={ t("change-password-form.confirm-password","Confirm password") } invalid={!!errors.confirmNew} error={errors?.confirmNew?.message}>
                <PasswordField
                  id="confirm-new-password"
                  autoComplete="new-password"
                  {...register('confirmNew', {
                    required: t( "change-password-form.errors.confirm-password-required",'New password confirmation is required'),
                    validate: (v) => v === getValues().newPassword || t( "change-password-form.errors.password-must-match",'Passwords must match'),
                  })}
                />
              </Field>
              <HorizontalGroup>
                <Button variant="primary" disabled={isSaving} type="submit">
                  {t('change-password-form.conform-change-password', 'Change Password')}
                </Button>
                <LinkButton variant="secondary" href={`${config.appSubUrl}/profile`} fill="outline">
                  {t('change-password-form.cancel', 'Cancel')}
                </LinkButton>
              </HorizontalGroup>
            </>
          );
        }}
      </Form>
    </div>
  );
};
