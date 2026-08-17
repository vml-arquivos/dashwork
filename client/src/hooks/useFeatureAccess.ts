import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/lib/api";
import { FEATURE_CATALOG } from "@/config/featureCatalog";
import { useAuth } from "@/hooks/useAuth";
import { ACCOUNT_CONTROLLED_FEATURES } from "@shared/accountProfiles";

type FeatureValueMap = Record<string, boolean>;

interface FeatureConfigMe {
  global?: FeatureValueMap;
  userOverride?: FeatureValueMap;
  accountModules?: string[];
  accountProfile?: string | null;
  updatedAt?: string;
}

let cachedConfig: FeatureConfigMe | null = null;
let cachedConfigKey: string | null = null;
let loadingPromise: Promise<FeatureConfigMe> | null = null;

async function fetchFeatureConfig(cacheKey: string): Promise<FeatureConfigMe> {
  if (cachedConfig && cachedConfigKey === cacheKey) return cachedConfig;
  if (!loadingPromise) {
    loadingPromise = apiFetch("/api/configuracao-funcoes/me")
      .then(data => {
        const resolved: FeatureConfigMe = data || {
          global: {},
          userOverride: {},
        };
        cachedConfig = resolved;
        cachedConfigKey = cacheKey;
        return resolved;
      })
      .finally(() => {
        loadingPromise = null;
      });
  }
  return loadingPromise;
}

export function invalidateFeatureAccessCache() {
  cachedConfig = null;
  cachedConfigKey = null;
  loadingPromise = null;
}

export function useFeatureAccess() {
  const { colaborador } = useAuth();
  const userCacheKey = colaborador?.id || "anonymous";
  const [config, setConfig] = useState<FeatureConfigMe | null>(cachedConfigKey === userCacheKey ? cachedConfig : null);
  const [loading, setLoading] = useState(!(cachedConfig && cachedConfigKey === userCacheKey));

  useEffect(() => {
    let alive = true;
    setLoading(!(cachedConfig && cachedConfigKey === userCacheKey));
    fetchFeatureConfig(userCacheKey)
      .then(data => {
        if (alive) setConfig(data);
      })
      .catch(() => {
        if (alive) setConfig({ global: {}, userOverride: {} });
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [userCacheKey]);

  const isAdministrador = ["administrador", "admin"].includes(
    (colaborador?.cargo || "").toLowerCase()
  );

  const enabledMap = useMemo(() => {
    const global = config?.global || {};
    const userOverride = config?.userOverride || {};
    const accountModules = new Set(config?.accountModules || []);
    const userModules = new Set(colaborador?.modulos_ativos || []);
    const controlled = new Set(ACCOUNT_CONTROLLED_FEATURES);
    const map: FeatureValueMap = {};
    for (const item of FEATURE_CATALOG) {
      if (accountModules.size > 0 && controlled.has(item.key) && !accountModules.has(item.key)) {
        map[item.key] = false;
        continue;
      }
      if (userModules.size > 0 && controlled.has(item.key) && !userModules.has(item.key)) {
        map[item.key] = false;
        continue;
      }
      if (item.key === "configuracao-funcoes" && isAdministrador) {
        map[item.key] = true;
        continue;
      }
      if (typeof userOverride[item.key] === "boolean")
        map[item.key] = userOverride[item.key];
      else if (typeof global[item.key] === "boolean")
        map[item.key] = global[item.key];
      else map[item.key] = true;
    }
    return map;
  }, [config, isAdministrador, colaborador?.modulos_ativos?.join("|")]);

  function isFeatureEnabled(featureKey?: string | null): boolean {
    if (!featureKey) return true;
    if (featureKey === "configuracao-funcoes" && isAdministrador) return true;
    if (enabledMap[featureKey] === undefined) return true;
    return enabledMap[featureKey];
  }

  return { loading, config, enabledMap, isFeatureEnabled };
}
