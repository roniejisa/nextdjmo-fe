import { LoadingContext } from ".//LoadingProvider";
import { useRouter } from "next/navigation";
import { useContext } from "react";

const useRouterCustom = () => {
  const router = useRouter();
  const { setTransition } = useContext(LoadingContext);
  const push = async (path) => {
    setTransition(true);
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
    setTransition(true);
    router.refresh();
  };

  const replace = async (path) => {
    setTransition(true);
    router.replace(path);
  };

  const prefetch = async (path) => {
    setTransition(true);
    router.prefetch(path);
  };

  return { push, back, forward, refresh, replace, prefetch };
};

export default useRouterCustom;