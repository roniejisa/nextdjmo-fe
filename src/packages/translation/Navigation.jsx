import { LoadingContext } from ".//LoadingProvider";
import { useRouter } from "next/navigation";
import { useContext } from "react";

const useRouterCustom = () => {
  const router = useRouter();
  const { setTransition, setIsRefresh, currentPathname } =
    useContext(LoadingContext);
  const push = async (path, isRefresh = false) => {
    if (currentPathname === path && !isRefresh) return;
    setTransition(true);
    setIsRefresh(isRefresh);
    router.push(path);
  };

  const back = async () => {
    setTransition(true);
    router.back();
  };

  const forward = async () => {
    setTransition(true);
    router.forward();
  };

  const refresh = async () => {
    router.refresh();
  };

  const replace = async (path, isRefresh = false) => {
    setTransition(true);
    setIsRefresh(isRefresh);
    router.push(path);
  };

  const prefetch = async (path, isRefresh = false) => {
    setTransition(true);
    setIsRefresh(isRefresh);
    router.prefetch(path);
  };

  return { push, back, forward, refresh, replace, prefetch };
};

export default useRouterCustom;
