import { css, cx } from '@emotion/css';
import { FC, useMemo } from 'react';

import { colorManipulator } from '@grafana/data';
import { useTheme2 } from '@grafana/ui';
import g8LoginDarkSvg from 'img/g8_login_dark.svg';
import g8LoginLightSvg from 'img/g8_login_light.svg';
import shirokumaLogoDark from "img/shirokuma/logo-dark.png"
import shirokumaLogoLight from "img/shirokuma/logo-light.png";
import shirokumaMiniLogoDark from "img/shirokuma/mini-logo-dark.png"
import shirokumaMiniLogoLight from "img/shirokuma/mini-logo-light.png";

export interface BrandComponentProps {
  className?: string;
  showMiniVer?: boolean;
  children?: JSX.Element | JSX.Element[];
}

export const LoginLogo: FC<BrandComponentProps & { logo?: string }> = ({ className, logo }) => {
  const theme = useTheme2();

  return <img className={className} src={`${logo ? logo : theme.isDark ? shirokumaLogoDark : shirokumaLogoLight}`} alt="shirokuma-logo" />;
};

const LoginBackground: FC<BrandComponentProps> = ({ className, children }) => {
  const theme = useTheme2();

  const background = css({
    '&:before': {
      content: '""',
      position: 'fixed',
      left: 0,
      right: 0,
      bottom: 0,
      top: 0,
      background: `url(${theme.isDark ? g8LoginDarkSvg : g8LoginLightSvg})`,
      backgroundPosition: 'top center',
      backgroundSize: 'auto',
      backgroundRepeat: 'no-repeat',

      opacity: 0,
      transition: 'opacity 3s ease-in-out',

      [theme.breakpoints.up('md')]: {
        backgroundPosition: 'center',
        backgroundSize: 'cover',
      },
    },
  });

  return <div className={cx(background, className)}>{children}</div>;
};

const MenuLogo: FC<BrandComponentProps> = ({ className, showMiniVer }) => {
  const theme = useTheme2();

  const logo = useMemo(() => {
    if (showMiniVer) {
      return theme.isDark ? shirokumaMiniLogoDark : shirokumaMiniLogoLight
    }
    return theme.isDark ? shirokumaLogoDark : shirokumaLogoLight
  }, [theme.isDark, showMiniVer]);

  return <img className={className} src={logo} alt="Grafana" />;
};

const LoginBoxBackground = () => {
  const theme = useTheme2();
  return css({
    background: colorManipulator.alpha(theme.colors.background.primary, 0.7),
    backgroundSize: 'cover',
  });
};

export class Branding {
  static LoginLogo = LoginLogo;
  static LoginBackground = LoginBackground;
  static MenuLogo = MenuLogo;
  static LoginBoxBackground = LoginBoxBackground;
  static AppTitle = 'EMS Monitoring';
  static LoginTitle = 'EMS Monitoring System';
  static HideEdition = false;
  static GetLoginSubTitle = (): null | string => {
    return null;
  };
}
