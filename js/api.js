export async function getIpInfo(ip) {
    const response = await fetch(`https://ipapi.co/${ip}/json/`);
    return await response.json();
}
