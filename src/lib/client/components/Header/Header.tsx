import {
  HStack,
  Typography,
} from '@/components';
import type { TypographyProps } from '@/components';
import {Logo} from "@/components/Logo";

interface HeaderLinkProps {
  href: string;
  label: string;
  color: TypographyProps['color'];
}

function HeaderLink(props: HeaderLinkProps) {
  const { href, label, color } = props;

  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      <Typography color={color} variant="body2" as="span">
        {label}
      </Typography>
    </a>
  );
}

interface HeaderProps {
  variant?: 'default' | 'white';
  fixed?: boolean;
}

export function Header(props: HeaderProps) {
  const { variant, fixed } = props;

  return (
    <HStack
      zIndex="rightAboveZero"
      position={fixed ? 'fixed' : 'relative'}
      fullWidth
      align="center"
      justify="center"
    >
      <HStack
        justify="spaceBetween"
        paddingX
        fullWidth
        /* eslint-disable-next-line react/forbid-component-props */
        className="h-[52px] max-w-[1440px]"
        align="center"
      >
        <HStack href="/" as="a" align="center">
          <Logo size="small" />
          <Typography bold variant="heading6" className="bg-gray-900">agentfile.directory</Typography>
        </HStack>
        <HStack gap="large" align="center">
          <HeaderLink
            color={variant === 'white' ? 'white' : 'default'}
            label={"Contribute"}
            href="https://github.com/letta-ai/agent-file/blob/main/agents/CONTRIBUTING.md"
          />
          <HeaderLink
            color={variant === 'white' ? 'white' : 'default'}
            label={"Docs"}
            href="https://docs.letta.com/"
          />
          <HeaderLink
            color={variant === 'white' ? 'white' : 'default'}
            label={"API"}
            href="https://docs.letta.com/api-reference/overview"
          />
          <a href="https://app.letta.com/" target="_blank" rel="noopener noreferrer" className="px-4 py-1 bg-gray-900 border rounded">
            <Typography variant="body2">Letta Platform</Typography>
          </a>
        </HStack>
      </HStack>
    </HStack>
  );
}
