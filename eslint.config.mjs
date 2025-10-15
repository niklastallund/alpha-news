    import { dirname } from "path";
    import { fileURLToPath } from "url";
    import { FlatCompat } from "@eslint/eslintrc";

    // 1. Import the Prettier Flat Config integration
    import prettierConfig from "eslint-config-prettier"; 

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);

    const compat = new FlatCompat({
      baseDirectory: __dirname,
    });

    // 2. Add 'prettierConfig' to the end of your configuration array
    const eslintConfig = [
      ...compat.extends("next/core-web-vitals", "next/typescript"),
      {
        ignores: [
          "node_modules/**",
          ".next/**",
          "out/**",
          "build/**",
          "next-env.d.ts",
        ],
      },
      // IMPORTANT: This must come LAST. It turns off all rules that conflict with Prettier.
      prettierConfig,
    ];

    export default eslintConfig;