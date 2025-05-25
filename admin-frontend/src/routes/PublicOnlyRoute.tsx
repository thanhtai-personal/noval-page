import { observer } from 'mobx-react-lite';

type Props = {
  children: React.ReactNode;
};

const PublicOnlyRoute = ({ children }: Props) => {
  return <>{children}</>;
};

export default observer(PublicOnlyRoute);
