const child_process = require("child_process");
const fs = require('fs');
const logger = require('./package-test-logger');
const testInfo = require('./package-test-info');


logger.info(`Start of "${__filename}"`);

function createPackage() {
  logger.info(`Start of "${testInfo.packageCreationCommand}"`);
  const stdout = child_process.execSync(testInfo.packageCreationCommand);
  logger.info(stdout.toString())
  logger.info(`End of "${testInfo.packageCreationCommand}"`);
}

function printItemsInReleaseDirectory() {
  logger.info("-----------------------------------------------");
  logger.info(`Following items exist in "${testInfo.releaseDirectory}":`)
  fs.readdirSync(testInfo.releaseDirectory).forEach(file => {
    logger.info(`  ${testInfo.releaseDirectory}/${file}`);
  })
  logger.info("-----------------------------------------------");
}

function testIfPackageExists() {
  logger.info(`Expected Package Location: "${testInfo.expectedPackageLocation}"`);
  if (fs.existsSync(testInfo.expectedPackageLocation)) {
    logger.info("Package exists in the expected location.");
  } else {
    const errorMessage = "Package does NOT exist in the expected location.";
    logger.error(errorMessage);
    throw new Error(errorMessage);
  }
}

function launchExecutable() {
  const executionTime = 30000;
  logger.info(`Launch executable and let it run for ${executionTime} ms.`);
  logger.info(`Executable Launch Command: "${testInfo.executableLaunchCommand}"`)
  const executableProcess = child_process.spawn(testInfo.executableLaunchCommand, [], { shell: true });

  executableProcess.stdout.on('data', function(data){
    logger.info(`stdout: ${data}`);
  });

  executableProcess.stderr.on('data', function(data){
    logger.warn(`stderr: ${data}`);
  });

  executableProcess.on('error', (err) => {
    logger.error(`Failed to start ${testInfo.executableLaunchCommand}`);
    logger.error(err);
    throw err;
  });

  executableProcess.on('close', (code) => {
    logger.info(`"${testInfo.executableLaunchCommand}" is terminated.`);
  });

  return new Promise(resolve => setTimeout(resolve, executionTime))
    .then(() => {
      const kill  = require('tree-kill');
      kill(executableProcess.pid);
    });
}

async function runPackageTest() {
  createPackage();
  printItemsInReleaseDirectory();
  testIfPackageExists();
  await launchExecutable();
}

runPackageTest()
.then(() => {
  logger.info(`End of "${__filename}"`);
  process.exitCode = 0;
}).catch((reason) => {
  logger.error(reason)
  logger.error(`End of "${__filename}" with some errors.`);
  process.exitCode = 1;
});
