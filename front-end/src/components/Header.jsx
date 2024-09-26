import { Avatar, Button, Flex, Image, Text, Link } from "@chakra-ui/react"

function Header() {
    return (
        <Flex bgColor={'#2F9B7C'} alignItems={'center'} justify={'space-between'}>
            <Flex alignItems={'center'} gap={5}>
                <Image src="https://legnet.com.br/favicon.png" w={'54px'} height={'auto'} p={'5px 0 5px 14px'} />
                <Link href="/" style={{ textDecoration: 'none' }} color={'white'}><strong>Legnet</strong> 2.0</Link>
            </Flex>
            <Button bgColor="#2F9B7C" colorScheme="green" leftIcon={<Avatar size='xs' />}>Premier Sistema de Gestão Ambiental Ltda - EPP (Juridico-Legnet)</Button>
        </Flex>
    )
}

export default Header